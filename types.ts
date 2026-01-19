
export enum UserRole {
  ADMIN = 'অ্যাডমিন',
  MEMBER = 'সদস্য'
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  address: string;
  bloodGroup: BloodGroup;
  designation: string;
  role: UserRole;
  password?: string;
  email: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  authorId: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}
