export interface Notification {
  id: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  title: string;
  message: string;
  type: 'INFO' | 'REMINDER' | 'ALERT';
  date: string;
  read: boolean;
}

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'REMINDER' | 'ALERT';
}