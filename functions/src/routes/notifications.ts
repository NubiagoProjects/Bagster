import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { notificationService } from '../services/notificationService';
import { ApiResponse, Notification } from '../types';

const router = Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const notifications = await notificationService.getUserNotifications(req.user.uid, Number(limit));

    const response: ApiResponse<Notification[]> = {
      success: true,
      data: notifications,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get notifications',
    };
    res.status(500).json(response);
  }
});

// Get unread count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.uid);

    const response: ApiResponse<{ count: number }> = {
      success: true,
      data: { count },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to get unread count',
    };
    res.status(500).json(response);
  }
});

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    await notificationService.markAsRead(notificationId);

    const response: ApiResponse = {
      success: true,
      message: 'Notification marked as read',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to mark notification as read',
    };
    res.status(500).json(response);
  }
});

// Mark all notifications as read
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.uid);

    const response: ApiResponse = {
      success: true,
      message: 'All notifications marked as read',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to mark all notifications as read',
    };
    res.status(500).json(response);
  }
});

// Delete notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    await notificationService.deleteNotification(notificationId);

    const response: ApiResponse = {
      success: true,
      message: 'Notification deleted successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete notification',
    };
    res.status(500).json(response);
  }
});

// Send system alert (Admin only)
router.post('/system-alert', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { userId, title, message, data } = req.body;

    if (!userId || !title || !message) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID, title, and message are required',
      };
      return res.status(400).json(response);
    }

    await notificationService.notifySystemAlert(userId, title, message, data);

    const response: ApiResponse = {
      success: true,
      message: 'System alert sent successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to send system alert',
    };
    res.status(500).json(response);
  }
});

// Broadcast to all users (Admin only)
router.post('/broadcast', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { title, message, data } = req.body;

    if (!title || !message) {
      const response: ApiResponse = {
        success: false,
        error: 'Title and message are required',
      };
      return res.status(400).json(response);
    }

    await notificationService.notifyAllUsers(title, message, data);

    const response: ApiResponse = {
      success: true,
      message: 'Broadcast sent successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to send broadcast',
    };
    res.status(500).json(response);
  }
});

// Notify users by type (Admin only)
router.post('/notify-by-type', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { userType, title, message, data } = req.body;

    if (!userType || !title || !message) {
      const response: ApiResponse = {
        success: false,
        error: 'User type, title, and message are required',
      };
      return res.status(400).json(response);
    }

    await notificationService.notifyUsersByType(userType, title, message, data);

    const response: ApiResponse = {
      success: true,
      message: `Notifications sent to all ${userType} users`,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to notify users by type',
    };
    res.status(500).json(response);
  }
});

export default router;
