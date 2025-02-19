export interface Message {
    id: number;
    content: string;
    senderId: number;
    receiverId: number;
    timestamp: Date;
    senderRole: 'ADMIN' | 'CLIENT';
  }