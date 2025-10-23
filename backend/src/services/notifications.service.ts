import { getMessaging } from 'firebase-admin/messaging';
import { conversations, messages, users } from '../store/data';

export const sendOrderStatusUpdate = async (orderId: string, customerId: string, tailorId: string, status: string) => {
  const messageContent = `Good news! The status of your order #${orderId.slice(0, 8)} has been updated to: ${status}.`;

  // 1. Send an in-app message
  try {
    let conversation = conversations.find(c => c.participants.includes(customerId) && c.participants.includes(tailorId));
    if (!conversation) {
      conversation = {
        id: `conv_${Date.now()}`,
        participants: [customerId, tailorId],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      conversations.push(conversation);
    }

    const message = {
      id: `msg_${Date.now()}`,
      conversationId: conversation.id,
      senderId: tailorId,
      recipientId: customerId,
      content: messageContent,
      messageType: 'text' as const,
      read: false,
      createdAt: new Date().toISOString(),
    };
    messages.push(message);
    conversation.updatedAt = new Date().toISOString();
  } catch (error) {
    console.error('Failed to send in-app message:', error);
  }

  // 2. Send a push notification
  try {
    const customer = users.get(customerId);
    // In a real app, you would get the user's FCM token from your database
    const fcmToken = 'customer-fcm-token'; // Placeholder

    if (customer && fcmToken) {
      await getMessaging().send({
        token: fcmToken,
        notification: {
          title: 'Order Status Update',
          body: messageContent,
        },
        data: {
          orderId,
          status,
        },
      });
    }
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
};
