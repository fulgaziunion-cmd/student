
import { User, UserRole, BloodGroup, Notice, Message, AppNotification } from '../types';

const STORAGE_KEYS = {
  USERS: 'group_sync_users',
  NOTICES: 'group_sync_notices',
  MESSAGES: 'group_sync_messages',
  NOTIFICATIONS: 'group_sync_notifications',
  SETTINGS: 'group_sync_settings'
};

export interface GroupSettings {
  name: string;
  logo: string | null;
  website: string | null; // ওয়েবসাইট লিংক যুক্ত করা হলো
}

const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'অ্যাডমিন',
    email: 'subokhan50s@gmail.com',
    mobile: '01700000000',
    address: 'বাংলাদেশ',
    bloodGroup: BloodGroup.O_POSITIVE,
    designation: 'অ্যাডমিনিস্ট্রেটর',
    role: UserRole.ADMIN,
    password: 'rdh5050'
  }
];

const INITIAL_SETTINGS: GroupSettings = {
  name: 'স্টুডেন্ট মুভমেন্ট অব বাংলাদেশ',
  logo: null,
  website: 'https://example.com' // ডিফল্ট ওয়েবসাইট
};

export const dbService = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
  },

  getSettings: (): GroupSettings => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(INITIAL_SETTINGS));
  },

  saveSettings: (settings: GroupSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    // Trigger storage event for reactivity across tabs
    window.dispatchEvent(new Event('storage'));
  },

  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  saveUser: (user: User) => {
    const users = dbService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  deleteUser: (id: string) => {
    const users = dbService.getUsers().filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getNotices: (): Notice[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICES) || '[]');
  },

  addNotice: (notice: Notice) => {
    const notices = dbService.getNotices();
    notices.unshift(notice);
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    
    const notification: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      message: `নতুন নোটিশ: ${notice.title}`,
      type: 'info',
      read: false
    };
    dbService.addNotification(notification);
    window.dispatchEvent(new Event('storage'));
  },

  deleteNotice: (id: string) => {
    const notices = dbService.getNotices().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  },

  getMessages: (): Message[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
  },

  addMessage: (message: Message) => {
    const messages = dbService.getMessages();
    messages.push(message);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    // Simulate real-time update
    window.dispatchEvent(new Event('storage'));
  },

  getNotifications: (): AppNotification[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  },

  addNotification: (notification: AppNotification) => {
    const notifications = dbService.getNotifications();
    notifications.unshift(notification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  markNotificationsRead: () => {
    const notifications = dbService.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};
