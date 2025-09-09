"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const firebase_1 = require("../config/firebase");
class UserService {
    constructor() {
        this.usersCollection = firebase_1.db.collection('users');
    }
    async createUser(userData) {
        try {
            const userRef = await this.usersCollection.add(Object.assign(Object.assign({}, userData), { createdAt: new Date(), updatedAt: new Date(), isActive: true }));
            const user = await userRef.get();
            return Object.assign({ id: userRef.id }, user.data());
        }
        catch (error) {
            throw new Error(`Failed to create user: ${error}`);
        }
    }
    async getUserById(userId) {
        try {
            const userDoc = await this.usersCollection.doc(userId).get();
            if (!userDoc.exists) {
                return null;
            }
            return Object.assign({ id: userDoc.id }, userDoc.data());
        }
        catch (error) {
            throw new Error(`Failed to get user: ${error}`);
        }
    }
    async getUserByEmail(email) {
        try {
            const query = await this.usersCollection.where('email', '==', email).limit(1).get();
            if (query.empty) {
                return null;
            }
            const userDoc = query.docs[0];
            return Object.assign({ id: userDoc.id }, userDoc.data());
        }
        catch (error) {
            throw new Error(`Failed to get user by email: ${error}`);
        }
    }
    async updateUser(userId, updateData) {
        try {
            await this.usersCollection.doc(userId).update(Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }));
            const updatedUser = await this.getUserById(userId);
            if (!updatedUser) {
                throw new Error('User not found after update');
            }
            return updatedUser;
        }
        catch (error) {
            throw new Error(`Failed to update user: ${error}`);
        }
    }
    async deleteUser(userId) {
        try {
            await this.usersCollection.doc(userId).delete();
        }
        catch (error) {
            throw new Error(`Failed to delete user: ${error}`);
        }
    }
    async listUsers(limit = 50) {
        try {
            const query = await this.usersCollection.limit(limit).get();
            return query.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            throw new Error(`Failed to list users: ${error}`);
        }
    }
    async updateUserPreferences(userId, preferences) {
        try {
            await this.usersCollection.doc(userId).update({
                preferences,
                updatedAt: new Date()
            });
        }
        catch (error) {
            throw new Error(`Failed to update user preferences: ${error}`);
        }
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=userService.js.map