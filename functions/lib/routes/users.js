"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const schemas_1 = require("../validation/schemas");
const userService_1 = require("../services/userService");
const router = (0, express_1.Router)();
// Register new user
router.post('/register', (0, validation_1.validateRequest)(schemas_1.userRegistrationSchema), async (req, res) => {
    try {
        const userData = req.body;
        const user = await userService_1.userService.createUser(userData);
        const response = {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                userType: user.userType,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                isVerified: user.isVerified,
                isActive: user.isActive,
                preferences: user.preferences,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            message: 'User registered successfully',
        };
        res.status(201).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to register user',
        };
        res.status(500).json(response);
    }
});
// Get user profile
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = await userService_1.userService.getUserById(req.user.uid);
        if (!user) {
            const response = {
                success: false,
                error: 'User not found',
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                userType: user.userType,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                isVerified: user.isVerified,
                isActive: user.isActive,
                preferences: user.preferences,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch user profile',
        };
        res.status(500).json(response);
    }
});
// Update user profile
router.put('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const updateData = req.body;
        const updatedUser = await userService_1.userService.updateUser(req.user.uid, updateData);
        const response = {
            success: true,
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                userType: updatedUser.userType,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                phone: updatedUser.phone,
                avatarUrl: updatedUser.avatarUrl,
                isVerified: updatedUser.isVerified,
                isActive: updatedUser.isActive,
                preferences: updatedUser.preferences,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            },
            message: 'Profile updated successfully',
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to update profile',
        };
        res.status(500).json(response);
    }
});
// Get all users (Admin only)
router.get('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const users = await userService_1.userService.listUsers();
        const response = {
            success: true,
            data: users.map(user => ({
                id: user.id,
                email: user.email,
                userType: user.userType,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                isVerified: user.isVerified,
                isActive: user.isActive,
                preferences: user.preferences,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            })),
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch users',
        };
        res.status(500).json(response);
    }
});
// Get specific user (Admin only)
router.get('/:userId', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userService_1.userService.getUserById(userId);
        if (!user) {
            const response = {
                success: false,
                error: 'User not found',
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                userType: user.userType,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                isVerified: user.isVerified,
                isActive: user.isActive,
                preferences: user.preferences,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to fetch user',
        };
        res.status(500).json(response);
    }
});
// Delete user (Admin only)
router.delete('/:userId', auth_1.authenticateToken, (0, auth_1.requireRole)(['admin']), async (req, res) => {
    try {
        const { userId } = req.params;
        await userService_1.userService.deleteUser(userId);
        const response = {
            success: true,
            message: 'User deleted successfully',
        };
        res.json(response);
    }
    catch (error) {
        const response = {
            success: false,
            error: 'Failed to delete user',
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map