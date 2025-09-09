'use client'

import { useState, useRef, useCallback } from 'react'
import { storage } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

interface FileUploadProps {
  maxFiles?: number
  maxSizeBytes?: number
  acceptedTypes?: string[]
  onFilesChange?: (files: UploadedFile[]) => void
  folder?: string
  className?: string
  multiple?: boolean
}

const defaultAcceptedTypes = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]

export default function FileUpload({
  maxFiles = 5,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  acceptedTypes = defaultAcceptedTypes,
  onFilesChange,
  folder = 'uploads',
  className = '',
  multiple = true
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    if (type === 'application/pdf') return FileText
    if (type.includes('document') || type.includes('word')) return FileText
    return File
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`
    }
    if (file.size > maxSizeBytes) {
      return `File size ${formatFileSize(file.size)} exceeds limit of ${formatFileSize(maxSizeBytes)}`
    }
    if (!multiple && files.length >= 1) {
      return 'Only one file is allowed'
    }
    if (files.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`
    }
    return null
  }

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const fileName = `${fileId}-${file.name}`
    const storageRef = ref(storage, `${folder}/${fileName}`)

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
        },
        (error) => {
          console.error('Upload error:', error)
          setUploading(prev => prev.filter(id => id !== fileId))
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[fileId]
            return newProgress
          })
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            const uploadedFile: UploadedFile = {
              id: fileId,
              name: file.name,
              size: file.size,
              type: file.type,
              url: downloadURL,
              uploadedAt: new Date()
            }
            
            setUploading(prev => prev.filter(id => id !== fileId))
            setUploadProgress(prev => {
              const newProgress = { ...prev }
              delete newProgress[fileId]
              return newProgress
            })
            
            resolve(uploadedFile)
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  }, [folder])

  const handleFileSelect = async (selectedFiles: FileList) => {
    const newErrors: string[] = []
    const validFiles: File[] = []

    Array.from(selectedFiles).forEach(file => {
      const error = validateFile(file)
      if (error) {
        newErrors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    setErrors(newErrors)

    if (validFiles.length === 0) return

    const uploadPromises = validFiles.map(async file => {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setUploading(prev => [...prev, fileId])

      try {
        const uploadedFile = await uploadFile(file)
        return uploadedFile
      } catch (error) {
        console.error('Failed to upload file:', error)
        newErrors.push(`${file.name}: Upload failed`)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter(Boolean) as UploadedFile[]

    if (successfulUploads.length > 0) {
      const updatedFiles = [...files, ...successfulUploads]
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
    }

    setErrors(prev => [...prev, ...newErrors])
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeFile = async (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return

    try {
      // Delete from Firebase Storage
      const fileRef = ref(storage, file.url)
      await deleteObject(fileRef)
      
      // Remove from state
      const updatedFiles = files.filter(f => f.id !== fileId)
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
    } catch (error) {
      console.error('Failed to delete file:', error)
      setErrors(prev => [...prev, `Failed to delete ${file.name}`])
    }
  }

  const clearErrors = () => setErrors([])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-2">
          Supports: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
        </p>
        <p className="text-xs text-gray-400">
          Max {maxFiles} files, {formatFileSize(maxSizeBytes)} each
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h4 className="text-red-800 font-medium">Upload Errors</h4>
            </div>
            <button
              onClick={clearErrors}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="text-sm text-red-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type)
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <FileIcon className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Uploading Files */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploading...</h4>
          <div className="space-y-2">
            {uploading.map((fileId) => (
              <div key={fileId} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">Uploading...</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(uploadProgress[fileId] || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[fileId] || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
