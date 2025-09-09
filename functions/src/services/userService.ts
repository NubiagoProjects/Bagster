import { db } from '../config/firebase';
import { User, UserPreferences } from '../types';

export class UserService {
  private usersCollection = db.collection('users');

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const userRef = await this.usersCollection.add({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });

      const user = await userRef.get();
      return { id: userRef.id, ...user.data() } as User;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await this.usersCollection.doc(userId).get();
      if (!userDoc.exists) {
        return null;
      }
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const query = await this.usersCollection.where('email', '==', email).limit(1).get();
      if (query.empty) {
        return null;
      }
      const userDoc = query.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error}`);
    }
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    try {
      await this.usersCollection.doc(userId).update({
        ...updateData,
        updatedAt: new Date()
      });

      const updatedUser = await this.getUserById(userId);
      if (!updatedUser) {
        throw new Error('User not found after update');
      }
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.usersCollection.doc(userId).delete();
    } catch (error) {
      throw new Error(`Failed to delete user: ${error}`);
    }
  }

  async listUsers(limit = 50): Promise<User[]> {
    try {
      const query = await this.usersCollection.limit(limit).get();
      return query.docs.map(doc => ({ id: doc.id, ...doc.data() }) as User);
    } catch (error) {
      throw new Error(`Failed to list users: ${error}`);
    }
  }

  async updateUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    try {
      await this.usersCollection.doc(userId).update({
        preferences,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new Error(`Failed to update user preferences: ${error}`);
    }
  }
}

export const userService = new UserService();