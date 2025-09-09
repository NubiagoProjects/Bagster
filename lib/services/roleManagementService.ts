'use client'

import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore'

export interface UserRole {
  id: string
  name: string
  description: string
  permissions: string[]
  level: number
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserPermission {
  userId: string
  roles: string[]
  customPermissions: string[]
  restrictions: string[]
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
}

export interface Permission {
  id: string
  name: string
  description: string
  category: string
  isSystem: boolean
}

// System permissions
const SYSTEM_PERMISSIONS = [
  // User Management
  { id: 'users.view', name: 'View Users', description: 'View user profiles and information', category: 'User Management' },
  { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', category: 'User Management' },
  { id: 'users.edit', name: 'Edit Users', description: 'Edit user profiles and information', category: 'User Management' },
  { id: 'users.delete', name: 'Delete Users', description: 'Delete user accounts', category: 'User Management' },
  { id: 'users.impersonate', name: 'Impersonate Users', description: 'Login as another user', category: 'User Management' },
  
  // Role Management
  { id: 'roles.view', name: 'View Roles', description: 'View roles and permissions', category: 'Role Management' },
  { id: 'roles.create', name: 'Create Roles', description: 'Create new roles', category: 'Role Management' },
  { id: 'roles.edit', name: 'Edit Roles', description: 'Edit existing roles', category: 'Role Management' },
  { id: 'roles.delete', name: 'Delete Roles', description: 'Delete roles', category: 'Role Management' },
  { id: 'roles.assign', name: 'Assign Roles', description: 'Assign roles to users', category: 'Role Management' },
  
  // Shipment Management
  { id: 'shipments.view', name: 'View Shipments', description: 'View shipment information', category: 'Shipment Management' },
  { id: 'shipments.create', name: 'Create Shipments', description: 'Create new shipments', category: 'Shipment Management' },
  { id: 'shipments.edit', name: 'Edit Shipments', description: 'Edit shipment details', category: 'Shipment Management' },
  { id: 'shipments.delete', name: 'Delete Shipments', description: 'Delete shipments', category: 'Shipment Management' },
  { id: 'shipments.track', name: 'Track Shipments', description: 'Access tracking information', category: 'Shipment Management' },
  { id: 'shipments.update_status', name: 'Update Status', description: 'Update shipment status', category: 'Shipment Management' },
  
  // Carrier Management
  { id: 'carriers.view', name: 'View Carriers', description: 'View carrier information', category: 'Carrier Management' },
  { id: 'carriers.create', name: 'Create Carriers', description: 'Register new carriers', category: 'Carrier Management' },
  { id: 'carriers.edit', name: 'Edit Carriers', description: 'Edit carrier profiles', category: 'Carrier Management' },
  { id: 'carriers.delete', name: 'Delete Carriers', description: 'Remove carriers', category: 'Carrier Management' },
  { id: 'carriers.verify', name: 'Verify Carriers', description: 'Verify carrier accounts', category: 'Carrier Management' },
  { id: 'carriers.assign', name: 'Assign Carriers', description: 'Assign carriers to shipments', category: 'Carrier Management' },
  
  // Financial Management
  { id: 'payments.view', name: 'View Payments', description: 'View payment information', category: 'Financial Management' },
  { id: 'payments.process', name: 'Process Payments', description: 'Process payment transactions', category: 'Financial Management' },
  { id: 'payments.refund', name: 'Process Refunds', description: 'Process refund requests', category: 'Financial Management' },
  { id: 'financial.reports', name: 'Financial Reports', description: 'Access financial reports', category: 'Financial Management' },
  
  // Analytics & Reporting
  { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics dashboard', category: 'Analytics & Reporting' },
  { id: 'analytics.export', name: 'Export Data', description: 'Export analytics data', category: 'Analytics & Reporting' },
  { id: 'reports.generate', name: 'Generate Reports', description: 'Generate custom reports', category: 'Analytics & Reporting' },
  
  // System Administration
  { id: 'system.settings', name: 'System Settings', description: 'Manage system settings', category: 'System Administration' },
  { id: 'system.maintenance', name: 'System Maintenance', description: 'Perform system maintenance', category: 'System Administration' },
  { id: 'system.logs', name: 'View System Logs', description: 'Access system logs', category: 'System Administration' },
  { id: 'system.backup', name: 'System Backup', description: 'Manage system backups', category: 'System Administration' },
  
  // Communication
  { id: 'notifications.send', name: 'Send Notifications', description: 'Send notifications to users', category: 'Communication' },
  { id: 'messages.view', name: 'View Messages', description: 'View user messages', category: 'Communication' },
  { id: 'messages.moderate', name: 'Moderate Messages', description: 'Moderate user communications', category: 'Communication' }
]

// System roles
const SYSTEM_ROLES = [
  {
    id: 'super_admin',
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: SYSTEM_PERMISSIONS.map(p => p.id),
    level: 100,
    isSystem: true
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Administrative access with most permissions',
    permissions: SYSTEM_PERMISSIONS.filter(p => !p.id.includes('system.') || p.id === 'system.logs').map(p => p.id),
    level: 90,
    isSystem: true
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Management access for operations',
    permissions: [
      'users.view', 'users.edit',
      'shipments.view', 'shipments.create', 'shipments.edit', 'shipments.track', 'shipments.update_status',
      'carriers.view', 'carriers.assign', 'carriers.verify',
      'payments.view', 'payments.process',
      'analytics.view', 'reports.generate',
      'notifications.send', 'messages.view'
    ],
    level: 70,
    isSystem: true
  },
  {
    id: 'carrier',
    name: 'Carrier',
    description: 'Carrier access for managing assigned shipments',
    permissions: [
      'shipments.view', 'shipments.track', 'shipments.update_status',
      'carriers.view', 'carriers.edit',
      'payments.view',
      'analytics.view',
      'messages.view'
    ],
    level: 50,
    isSystem: true
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    description: 'Customer service representative access',
    permissions: [
      'users.view', 'users.edit',
      'shipments.view', 'shipments.track',
      'carriers.view',
      'payments.view',
      'notifications.send', 'messages.view', 'messages.moderate'
    ],
    level: 40,
    isSystem: true
  },
  {
    id: 'user',
    name: 'User',
    description: 'Standard user access',
    permissions: [
      'shipments.view', 'shipments.create', 'shipments.track',
      'carriers.view',
      'payments.view',
      'messages.view'
    ],
    level: 10,
    isSystem: true
  }
]

class RoleManagementService {
  // Initialize system roles and permissions
  async initializeSystemRoles(): Promise<void> {
    try {
      // Add system permissions
      for (const permission of SYSTEM_PERMISSIONS) {
        const permissionRef = doc(db, 'permissions', permission.id)
        const permissionDoc = await getDoc(permissionRef)
        
        if (!permissionDoc.exists()) {
          await updateDoc(permissionRef, {
            ...permission,
            isSystem: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }

      // Add system roles
      for (const role of SYSTEM_ROLES) {
        const roleRef = doc(db, 'roles', role.id)
        const roleDoc = await getDoc(roleRef)
        
        if (!roleDoc.exists()) {
          await updateDoc(roleRef, {
            ...role,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }

      console.log('System roles and permissions initialized')
    } catch (error) {
      console.error('Failed to initialize system roles:', error)
      throw error
    }
  }

  // Get all roles
  async getRoles(): Promise<UserRole[]> {
    try {
      const rolesQuery = query(collection(db, 'roles'), orderBy('level', 'desc'))
      const snapshot = await getDocs(rolesQuery)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as UserRole[]
    } catch (error) {
      console.error('Failed to get roles:', error)
      return []
    }
  }

  // Get role by ID
  async getRole(roleId: string): Promise<UserRole | null> {
    try {
      const roleDoc = await getDoc(doc(db, 'roles', roleId))
      
      if (!roleDoc.exists()) {
        return null
      }

      return {
        id: roleDoc.id,
        ...roleDoc.data(),
        createdAt: roleDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: roleDoc.data().updatedAt?.toDate() || new Date()
      } as UserRole
    } catch (error) {
      console.error('Failed to get role:', error)
      return null
    }
  }

  // Create custom role
  async createRole(role: Omit<UserRole, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const roleData = {
        ...role,
        isSystem: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const docRef = await addDoc(collection(db, 'roles'), roleData)
      console.log(`Role created: ${role.name}`)
      return docRef.id
    } catch (error) {
      console.error('Failed to create role:', error)
      throw error
    }
  }

  // Update role
  async updateRole(roleId: string, updates: Partial<UserRole>): Promise<void> {
    try {
      const role = await this.getRole(roleId)
      if (!role) {
        throw new Error('Role not found')
      }

      if (role.isSystem) {
        throw new Error('Cannot modify system roles')
      }

      await updateDoc(doc(db, 'roles', roleId), {
        ...updates,
        updatedAt: new Date()
      })

      console.log(`Role updated: ${roleId}`)
    } catch (error) {
      console.error('Failed to update role:', error)
      throw error
    }
  }

  // Delete role
  async deleteRole(roleId: string): Promise<void> {
    try {
      const role = await this.getRole(roleId)
      if (!role) {
        throw new Error('Role not found')
      }

      if (role.isSystem) {
        throw new Error('Cannot delete system roles')
      }

      // Check if role is assigned to any users
      const usersWithRole = await getDocs(
        query(collection(db, 'userPermissions'), where('roles', 'array-contains', roleId))
      )

      if (!usersWithRole.empty) {
        throw new Error('Cannot delete role that is assigned to users')
      }

      await deleteDoc(doc(db, 'roles', roleId))
      console.log(`Role deleted: ${roleId}`)
    } catch (error) {
      console.error('Failed to delete role:', error)
      throw error
    }
  }

  // Get all permissions
  async getPermissions(): Promise<Permission[]> {
    try {
      const permissionsQuery = query(collection(db, 'permissions'), orderBy('category'), orderBy('name'))
      const snapshot = await getDocs(permissionsQuery)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Permission[]
    } catch (error) {
      console.error('Failed to get permissions:', error)
      return []
    }
  }

  // Get user permissions
  async getUserPermissions(userId: string): Promise<UserPermission | null> {
    try {
      const permissionDoc = await getDoc(doc(db, 'userPermissions', userId))
      
      if (!permissionDoc.exists()) {
        return null
      }

      return {
        ...permissionDoc.data(),
        assignedAt: permissionDoc.data().assignedAt?.toDate() || new Date(),
        expiresAt: permissionDoc.data().expiresAt?.toDate()
      } as UserPermission
    } catch (error) {
      console.error('Failed to get user permissions:', error)
      return null
    }
  }

  // Assign roles to user
  async assignRoles(
    userId: string,
    roleIds: string[],
    assignedBy: string,
    expiresAt?: Date
  ): Promise<void> {
    try {
      // Validate roles exist
      const rolePromises = roleIds.map(roleId => this.getRole(roleId))
      const roles = await Promise.all(rolePromises)
      
      const invalidRoles = roles.filter(role => !role)
      if (invalidRoles.length > 0) {
        throw new Error('One or more roles do not exist')
      }

      const userPermission: UserPermission = {
        userId,
        roles: roleIds,
        customPermissions: [],
        restrictions: [],
        assignedBy,
        assignedAt: new Date(),
        ...(expiresAt && { expiresAt })
      }

      await updateDoc(doc(db, 'userPermissions', userId), userPermission as any)
      console.log(`Roles assigned to user ${userId}:`, roleIds)
    } catch (error) {
      console.error('Failed to assign roles:', error)
      throw error
    }
  }

  // Add custom permission to user
  async addCustomPermission(userId: string, permission: string): Promise<void> {
    try {
      const userPermissions = await this.getUserPermissions(userId)
      
      if (!userPermissions) {
        throw new Error('User permissions not found')
      }

      const customPermissions = [...userPermissions.customPermissions]
      if (!customPermissions.includes(permission)) {
        customPermissions.push(permission)
        
        await updateDoc(doc(db, 'userPermissions', userId), {
          customPermissions
        })
        
        console.log(`Custom permission added to user ${userId}: ${permission}`)
      }
    } catch (error) {
      console.error('Failed to add custom permission:', error)
      throw error
    }
  }

  // Remove custom permission from user
  async removeCustomPermission(userId: string, permission: string): Promise<void> {
    try {
      const userPermissions = await this.getUserPermissions(userId)
      
      if (!userPermissions) {
        throw new Error('User permissions not found')
      }

      const customPermissions = userPermissions.customPermissions.filter(p => p !== permission)
      
      await updateDoc(doc(db, 'userPermissions', userId), {
        customPermissions
      })
      
      console.log(`Custom permission removed from user ${userId}: ${permission}`)
    } catch (error) {
      console.error('Failed to remove custom permission:', error)
      throw error
    }
  }

  // Check if user has permission
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(userId)
      
      if (!userPermissions) {
        return false
      }

      // Check if permission is restricted
      if (userPermissions.restrictions.includes(permission)) {
        return false
      }

      // Check custom permissions
      if (userPermissions.customPermissions.includes(permission)) {
        return true
      }

      // Check role permissions
      const rolePromises = userPermissions.roles.map(roleId => this.getRole(roleId))
      const roles = await Promise.all(rolePromises)
      
      return roles.some(role => role && role.permissions.includes(permission))
    } catch (error) {
      console.error('Failed to check permission:', error)
      return false
    }
  }

  // Get effective permissions for user
  async getEffectivePermissions(userId: string): Promise<string[]> {
    try {
      const userPermissions = await this.getUserPermissions(userId)
      
      if (!userPermissions) {
        return []
      }

      // Get permissions from roles
      const rolePromises = userPermissions.roles.map(roleId => this.getRole(roleId))
      const roles = await Promise.all(rolePromises)
      
      const rolePermissions = roles
        .filter(role => role !== null)
        .flatMap(role => role!.permissions)

      // Combine role permissions and custom permissions
      const allPermissions = Array.from(new Set([...rolePermissions, ...userPermissions.customPermissions]))
      
      // Remove restricted permissions
      return allPermissions.filter(permission => !userPermissions.restrictions.includes(permission))
    } catch (error) {
      console.error('Failed to get effective permissions:', error)
      return []
    }
  }

  // Get users with role
  async getUsersWithRole(roleId: string): Promise<string[]> {
    try {
      const usersQuery = query(
        collection(db, 'userPermissions'),
        where('roles', 'array-contains', roleId)
      )
      
      const snapshot = await getDocs(usersQuery)
      return snapshot.docs.map(doc => doc.id)
    } catch (error) {
      console.error('Failed to get users with role:', error)
      return []
    }
  }

  // Bulk assign roles
  async bulkAssignRoles(
    userIds: string[],
    roleIds: string[],
    assignedBy: string
  ): Promise<void> {
    try {
      const promises = userIds.map(userId =>
        this.assignRoles(userId, roleIds, assignedBy)
      )
      
      await Promise.all(promises)
      console.log(`Bulk role assignment completed for ${userIds.length} users`)
    } catch (error) {
      console.error('Failed to bulk assign roles:', error)
      throw error
    }
  }

  // Get role hierarchy
  async getRoleHierarchy(): Promise<UserRole[]> {
    try {
      const roles = await this.getRoles()
      return roles.sort((a, b) => b.level - a.level)
    } catch (error) {
      console.error('Failed to get role hierarchy:', error)
      return []
    }
  }
}

export const roleManagementService = new RoleManagementService()
export default roleManagementService
