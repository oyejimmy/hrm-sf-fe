import { leaveApi } from './leaveApi';
import { LeaveRequest, Employee } from '../../features/employee/EmployeeLeaveManagement/types';

export interface EmailNotificationData {
  requestId: string;
  recipientIds: string[];
  type: 'request' | 'approval' | 'rejection' | 'hold' | 'details_request';
  leaveRequest?: LeaveRequest;
  additionalData?: any;
}

export class EmailNotificationService {
  static async sendLeaveRequestNotification(
    leaveRequest: LeaveRequest,
    recipients: Employee[]
  ): Promise<void> {
    try {
      await leaveApi.sendLeaveNotificationEmail({
        requestId: leaveRequest.id,
        recipientIds: recipients.map(r => r.id),
        type: 'request'
      });

      // Log notification for tracking (sanitized)
      console.log('Leave request notification sent to recipients:', recipients.length);
    } catch (error) {
      console.error('Failed to send leave request notification:', error);
      throw error;
    }
  }

  static async sendApprovalNotification(
    requestId: string,
    employeeId: string,
    action: 'approval' | 'rejection' | 'hold' | 'details_request',
    comments?: string
  ): Promise<void> {
    try {
      await leaveApi.sendLeaveNotificationEmail({
        requestId,
        recipientIds: [employeeId],
        type: action
      });

      console.log(`Leave ${action} notification sent for request ${requestId}`);
    } catch (error) {
      console.error(`Failed to send ${action} notification:`, error);
      throw error;
    }
  }

  static async sendBulkNotifications(
    notifications: EmailNotificationData[]
  ): Promise<void> {
    try {
      const promises = notifications.map(notification =>
        leaveApi.sendLeaveNotificationEmail(notification)
      );

      await Promise.all(promises);
      console.log(`Bulk notifications sent: ${notifications.length} emails`);
    } catch (error) {
      console.error('Failed to send bulk notifications:', error);
      throw error;
    }
  }

  static generateNotificationMessage(
    type: string,
    leaveRequest: LeaveRequest,
    additionalData?: any
  ): string {
    switch (type) {
      case 'request':
        return `New leave request from ${leaveRequest.employeeName} for ${leaveRequest.type} leave (${leaveRequest.duration} days) from ${new Date(leaveRequest.from).toLocaleDateString()} to ${new Date(leaveRequest.to).toLocaleDateString()}. Reason: ${leaveRequest.reason}`;
      
      case 'approval':
        return `Your leave request for ${leaveRequest.type} leave has been approved. You can proceed with your planned leave from ${new Date(leaveRequest.from).toLocaleDateString()} to ${new Date(leaveRequest.to).toLocaleDateString()}.`;
      
      case 'rejection':
        return `Your leave request for ${leaveRequest.type} leave has been rejected. ${additionalData?.comments ? `Reason: ${additionalData.comments}` : 'Please contact HR for more details.'}`;
      
      case 'hold':
        return `Your leave request for ${leaveRequest.type} leave has been placed on hold. ${additionalData?.comments ? `Reason: ${additionalData.comments}` : 'Please wait for further updates.'}`;
      
      case 'details_request':
        return `Additional details are required for your leave request. ${additionalData?.additionalDetailsRequired || 'Please provide more information to proceed with your request.'}`;
      
      default:
        return `Update on your leave request for ${leaveRequest.type} leave.`;
    }
  }
}