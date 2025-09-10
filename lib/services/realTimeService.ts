import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { authService } from '../auth';
import { db } from '../firebase';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

export interface RealTimeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'admin' | 'carrier' | 'customer';
  recipientId: string;
  shipmentId?: string;
  message: string;
  timestamp: Date;
  read: boolean;
  messageType: 'text' | 'location' | 'image' | 'status_update';
  metadata?: {
    location?: { lat: number; lng: number };
    imageUrl?: string;
    statusUpdate?: string;
  };
}

export interface TrackingUpdate {
  shipmentId: string;
  status: string;
  location: string;
  timestamp: Date;
  description: string;
  carrierId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface NotificationData {
  userId: string;
  type: 'assignment' | 'status_update' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

class RealTimeService {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  private userSockets: Map<string, string> = new Map(); // socketId -> userId

  public initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', async (token: string) => {
        try {
          const decoded = authService.verifyJWT(token);
          const userId = decoded.userId;
          
          // Store user-socket mapping
          this.connectedUsers.set(userId, socket.id);
          this.userSockets.set(socket.id, userId);
          
          // Join user-specific room
          socket.join(`user_${userId}`);
          
          // Join role-specific rooms
          socket.join(`role_${decoded.userType}`);
          
          console.log(`User ${userId} authenticated and joined rooms`);
          
          // Send authentication success
          socket.emit('authenticated', { userId, userType: decoded.userType });
          
          // Set up real-time listeners for this user
          this.setupUserListeners(userId, socket);
          
        } catch (error) {
          console.error('Authentication failed:', error);
          socket.emit('auth_error', { message: 'Invalid token' });
          socket.disconnect();
        }
      });

      // Handle shipment tracking subscription
      socket.on('subscribe_tracking', (shipmentId: string) => {
        socket.join(`shipment_${shipmentId}`);
        console.log(`Socket ${socket.id} subscribed to shipment ${shipmentId}`);
      });

      // Handle chat messages
      socket.on('send_message', async (messageData: Partial<RealTimeMessage>) => {
        try {
          const userId = this.userSockets.get(socket.id);
          if (!userId) return;

          const message: RealTimeMessage = {
            id: '',
            senderId: userId,
            senderName: messageData.senderName || 'Unknown',
            senderType: messageData.senderType || 'customer',
            recipientId: messageData.recipientId!,
            shipmentId: messageData.shipmentId,
            message: messageData.message!,
            timestamp: new Date(),
            read: false,
            messageType: messageData.messageType || 'text',
            metadata: messageData.metadata
          };

          // Save to database
          const docRef = await addDoc(collection(db, 'messages'), {
            ...message,
            timestamp: serverTimestamp()
          });
          
          message.id = docRef.id;

          // Send to recipient
          this.sendToUser(message.recipientId, 'new_message', message);
          
          // Send confirmation to sender
          socket.emit('message_sent', message);

        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('message_error', { error: 'Failed to send message' });
        }
      });

      // Handle location updates
      socket.on('update_location', async (data: { shipmentId: string; location: { lat: number; lng: number } }) => {
        try {
          const userId = this.userSockets.get(socket.id);
          if (!userId) return;

          const update: TrackingUpdate = {
            shipmentId: data.shipmentId,
            status: 'in_transit',
            location: `${data.location.lat}, ${data.location.lng}`,
            timestamp: new Date(),
            description: 'Location updated',
            carrierId: userId,
            coordinates: data.location
          };

          // Broadcast to all subscribers of this shipment
          this.io!.to(`shipment_${data.shipmentId}`).emit('tracking_update', update);

          // Save to database
          await addDoc(collection(db, 'tracking_updates'), {
            ...update,
            timestamp: serverTimestamp()
          });

        } catch (error) {
          console.error('Error updating location:', error);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        const userId = this.userSockets.get(socket.id);
        if (userId) {
          this.connectedUsers.delete(userId);
          this.userSockets.delete(socket.id);
          console.log(`User ${userId} disconnected`);
        }
      });
    });
  }

  private setupUserListeners(userId: string, socket: any): void {
    // Listen for new messages
    const messagesQuery = query(
      collection(db, 'messages'),
      where('recipientId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    onSnapshot(messagesQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const message = { id: change.doc.id, ...change.doc.data() } as RealTimeMessage;
          socket.emit('new_message', message);
        }
      });
    });

    // Listen for notifications
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('timestamp', 'desc')
    );

    onSnapshot(notificationsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const notification = { id: change.doc.id, ...change.doc.data() } as NotificationData;
          socket.emit('new_notification', notification);
        }
      });
    });
  }

  // Public methods for sending real-time updates
  public sendToUser(userId: string, event: string, data: any): void {
    if (!this.io) return;
    
    this.io.to(`user_${userId}`).emit(event, data);
  }

  public sendToRole(role: string, event: string, data: any): void {
    if (!this.io) return;
    
    this.io.to(`role_${role}`).emit(event, data);
  }

  public broadcastTrackingUpdate(shipmentId: string, update: TrackingUpdate): void {
    if (!this.io) return;
    
    this.io.to(`shipment_${shipmentId}`).emit('tracking_update', update);
  }

  public async sendNotification(notification: NotificationData): Promise<void> {
    try {
      // Save to database
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        timestamp: serverTimestamp()
      });

      // Send real-time notification
      this.sendToUser(notification.userId, 'new_notification', notification);

    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  public async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        read: true
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  public async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}

export const realTimeService = new RealTimeService();
