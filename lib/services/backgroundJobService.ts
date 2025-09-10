import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export interface BackgroundJob {
  id: string;
  type: 'assignment_timeout' | 'notification_retry' | 'cleanup' | 'analytics';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  data: any;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  attempts: number;
  maxAttempts: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobResult {
  success: boolean;
  data?: any;
  error?: string;
}

class BackgroundJobService {
  private jobsCollection = collection(db, 'background_jobs');
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  public async initialize(): Promise<void> {
    console.log('🔄 Initializing Background Job Service...');
    
    // Start job processor
    this.startJobProcessor();
    
    // Clean up old completed jobs
    await this.cleanupOldJobs();
    
    console.log('✅ Background Job Service initialized');
  }

  public async scheduleJob(
    type: BackgroundJob['type'],
    data: any,
    scheduledAt: Date = new Date(),
    maxAttempts: number = 3
  ): Promise<string> {
    try {
      const job: Omit<BackgroundJob, 'id'> = {
        type,
        status: 'pending',
        data,
        scheduledAt,
        attempts: 0,
        maxAttempts,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(this.jobsCollection, {
        ...job,
        scheduledAt: Timestamp.fromDate(scheduledAt),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log(`📋 Scheduled ${type} job: ${docRef.id} for ${scheduledAt.toISOString()}`);
      return docRef.id;
    } catch (error) {
      console.error('Error scheduling job:', error);
      throw new Error('Failed to schedule job');
    }
  }

  public async scheduleAssignmentTimeout(
    assignmentId: string,
    timeoutAt: Date
  ): Promise<string> {
    return this.scheduleJob(
      'assignment_timeout',
      { assignmentId },
      timeoutAt,
      1 // Only try once for timeouts
    );
  }

  public async scheduleNotificationRetry(
    notificationId: string,
    retryAt: Date
  ): Promise<string> {
    return this.scheduleJob(
      'notification_retry',
      { notificationId },
      retryAt,
      5 // Retry notifications up to 5 times
    );
  }

  public async cancelJob(jobId: string): Promise<void> {
    try {
      await updateDoc(doc(this.jobsCollection, jobId), {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
      console.log(`❌ Cancelled job: ${jobId}`);
    } catch (error) {
      console.error('Error cancelling job:', error);
    }
  }

  private startJobProcessor(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    // Process jobs every 30 seconds
    this.processingInterval = setInterval(async () => {
      if (!this.isProcessing) {
        await this.processJobs();
      }
    }, 30000);

    // Also process immediately
    setTimeout(() => this.processJobs(), 1000);
  }

  private async processJobs(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // Get pending jobs that are due
      const now = new Date();
      const jobsQuery = query(
        this.jobsCollection,
        where('status', '==', 'pending'),
        where('scheduledAt', '<=', Timestamp.fromDate(now)),
        orderBy('scheduledAt', 'asc')
      );

      const snapshot = await getDocs(jobsQuery);
      
      for (const jobDoc of snapshot.docs) {
        const job = { id: jobDoc.id, ...jobDoc.data() } as BackgroundJob;
        await this.processJob(job);
      }
    } catch (error) {
      console.error('Error processing jobs:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processJob(job: BackgroundJob): Promise<void> {
    try {
      console.log(`🔄 Processing job: ${job.id} (${job.type})`);

      // Mark job as running
      await updateDoc(doc(this.jobsCollection, job.id), {
        status: 'running',
        startedAt: serverTimestamp(),
        attempts: job.attempts + 1,
        updatedAt: serverTimestamp()
      });

      let result: JobResult;

      // Execute job based on type
      switch (job.type) {
        case 'assignment_timeout':
          result = await this.handleAssignmentTimeout(job.data);
          break;
        case 'notification_retry':
          result = await this.handleNotificationRetry(job.data);
          break;
        case 'cleanup':
          result = await this.handleCleanup(job.data);
          break;
        case 'analytics':
          result = await this.handleAnalytics(job.data);
          break;
        default:
          result = { success: false, error: `Unknown job type: ${job.type}` };
      }

      // Update job status based on result
      if (result.success) {
        await updateDoc(doc(this.jobsCollection, job.id), {
          status: 'completed',
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`✅ Completed job: ${job.id}`);
      } else {
        await this.handleJobFailure(job, result.error || 'Unknown error');
      }
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      await this.handleJobFailure(job, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async handleJobFailure(job: BackgroundJob, error: string): Promise<void> {
    const newAttempts = job.attempts + 1;
    
    if (newAttempts >= job.maxAttempts) {
      // Max attempts reached, mark as failed
      await updateDoc(doc(this.jobsCollection, job.id), {
        status: 'failed',
        error,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`❌ Job failed after ${newAttempts} attempts: ${job.id}`);
    } else {
      // Schedule retry with exponential backoff
      const retryDelay = Math.pow(2, newAttempts) * 60000; // 2^n minutes
      const retryAt = new Date(Date.now() + retryDelay);
      
      await updateDoc(doc(this.jobsCollection, job.id), {
        status: 'pending',
        scheduledAt: Timestamp.fromDate(retryAt),
        error,
        updatedAt: serverTimestamp()
      });
      console.log(`🔄 Retrying job ${job.id} in ${retryDelay / 60000} minutes`);
    }
  }

  private async handleAssignmentTimeout(data: any): Promise<JobResult> {
    try {
      const { assignmentId } = data;
      
      // Import here to avoid circular dependency
      const { shipmentAssignmentService } = await import('./shipmentAssignmentService');
      
      // Check if assignment is still pending
      const assignment = await shipmentAssignmentService.getAssignment(assignmentId);
      
      if (assignment && assignment.status === 'pending') {
        console.log(`⏰ Assignment ${assignmentId} timed out, triggering reassignment`);
        await shipmentAssignmentService.handleAssignmentExpiry(assignmentId);
        return { success: true };
      } else {
        console.log(`⏰ Assignment ${assignmentId} already processed, skipping timeout`);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async handleNotificationRetry(data: any): Promise<JobResult> {
    try {
      const { notificationId } = data;
      
      // Import here to avoid circular dependency
      const { notificationService } = await import('./notificationService');
      
      await notificationService.retryFailedNotification(notificationId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async handleCleanup(data: any): Promise<JobResult> {
    try {
      const { type, olderThan } = data;
      
      switch (type) {
        case 'old_jobs':
          await this.cleanupOldJobs(olderThan);
          break;
        case 'expired_sessions':
          await this.cleanupExpiredSessions();
          break;
        case 'temp_files':
          await this.cleanupTempFiles();
          break;
        default:
          throw new Error(`Unknown cleanup type: ${type}`);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async handleAnalytics(data: any): Promise<JobResult> {
    try {
      const { type, period } = data;
      
      // Import here to avoid circular dependency
      const { analyticsService } = await import('../services/analyticsService');
      
      switch (type) {
        case 'daily_report':
          await analyticsService.generateDailyReport(period);
          break;
        case 'carrier_performance':
          await analyticsService.calculateCarrierPerformance(period);
          break;
        case 'revenue_summary':
          await analyticsService.generateRevenueSummary(period);
          break;
        default:
          throw new Error(`Unknown analytics type: ${type}`);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async cleanupOldJobs(olderThanDays: number = 7): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      const oldJobsQuery = query(
        this.jobsCollection,
        where('status', 'in', ['completed', 'failed', 'cancelled']),
        where('completedAt', '<', Timestamp.fromDate(cutoffDate))
      );
      
      const snapshot = await getDocs(oldJobsQuery);
      
      for (const jobDoc of snapshot.docs) {
        await deleteDoc(jobDoc.ref);
      }
      
      console.log(`🧹 Cleaned up ${snapshot.size} old jobs`);
    } catch (error) {
      console.error('Error cleaning up old jobs:', error);
    }
  }

  private async cleanupExpiredSessions(): Promise<void> {
    // Implementation for cleaning up expired user sessions
    console.log('🧹 Cleaning up expired sessions');
  }

  private async cleanupTempFiles(): Promise<void> {
    // Implementation for cleaning up temporary files
    console.log('🧹 Cleaning up temporary files');
  }

  public async scheduleRecurringJobs(): Promise<void> {
    // Schedule daily cleanup
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0); // 2 AM

    await this.scheduleJob('cleanup', { type: 'old_jobs', olderThan: 7 }, tomorrow);
    
    // Schedule daily analytics
    const analyticsTime = new Date(tomorrow);
    analyticsTime.setHours(3, 0, 0, 0); // 3 AM
    
    await this.scheduleJob('analytics', { type: 'daily_report', period: 'yesterday' }, analyticsTime);
    
    console.log('📅 Scheduled recurring jobs');
  }

  public stop(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    console.log('🛑 Background Job Service stopped');
  }
}

export const backgroundJobService = new BackgroundJobService();
