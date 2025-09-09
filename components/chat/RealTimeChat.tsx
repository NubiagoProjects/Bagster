'use client'

import { useState, useEffect, useRef } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, User } from 'lucide-react'

interface Message {
  id: string
  text: string
  senderId: string
  senderName: string
  timestamp: Date
  type: 'text' | 'image' | 'file'
  fileUrl?: string
  fileName?: string
  isRead: boolean
}

interface ChatParticipant {
  id: string
  name: string
  email: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
}

interface RealTimeChatProps {
  chatId: string
  currentUserId: string
  currentUserName: string
  participants: ChatParticipant[]
  className?: string
}

export default function RealTimeChat({
  chatId,
  currentUserId,
  currentUserName,
  participants,
  className = ''
}: RealTimeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Real-time message listener
  useEffect(() => {
    if (!chatId) return

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Message[]

      setMessages(newMessages)
      setLoading(false)
      scrollToBottom()
    })

    return () => unsubscribe()
  }, [chatId])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: newMessage.trim(),
        senderId: currentUserId,
        senderName: currentUserName,
        timestamp: serverTimestamp(),
        type: 'text',
        isRead: false
      })

      setNewMessage('')
      inputRef.current?.focus()
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Mark messages as read
  const markMessagesAsRead = async () => {
    const unreadMessages = messages.filter(msg => 
      msg.senderId !== currentUserId && !msg.isRead
    )

    const promises = unreadMessages.map(msg =>
      updateDoc(doc(db, 'chats', chatId, 'messages', msg.id), {
        isRead: true
      })
    )

    await Promise.all(promises)
  }

  useEffect(() => {
    markMessagesAsRead()
  }, [messages])

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Get other participants (excluding current user)
  const otherParticipants = participants.filter(p => p.id !== currentUserId)

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg border ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {otherParticipants[0]?.avatar ? (
              <img
                src={otherParticipants[0].avatar}
                alt={otherParticipants[0].name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
            {otherParticipants[0]?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {otherParticipants.map(p => p.name).join(', ')}
            </h3>
            <p className="text-sm text-gray-500">
              {otherParticipants[0]?.isOnline ? 'Online' : `Last seen ${formatTime(otherParticipants[0]?.lastSeen || new Date())}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.senderId === currentUserId
            const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId
            const showTimestamp = index === messages.length - 1 || 
              messages[index + 1].senderId !== message.senderId ||
              (messages[index + 1].timestamp.getTime() - message.timestamp.getTime()) > 300000 // 5 minutes

            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${isOwn ? 'ml-2' : 'mr-2'}`}>
                    {showAvatar && !isOwn ? (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8"></div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>

                    {/* Timestamp */}
                    {showTimestamp && (
                      <div className={`mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                          {isOwn && (
                            <span className="ml-1">
                              {message.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Typing Indicator */}
        {isTyping.length > 0 && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-500">
                {isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <Smile className="w-5 h-5" />
          </button>

          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className={`p-2 rounded-full transition-colors ${
              newMessage.trim() && !sending
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
