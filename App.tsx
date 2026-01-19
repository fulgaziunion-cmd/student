
import React, { useState, useEffect } from 'react';
import { User, Notice, Message, AppNotification } from './types';
import { dbService, GroupSettings } from './services/dbService';
import Layout from './components/Layout';
import Auth from './components/Auth';
import MemberDirectory from './components/MemberDirectory';
import NoticeBoard from './components/NoticeBoard';
import ChatRoom from './components/ChatRoom';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('directory');
  
  const [members, setMembers] = useState<User[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [groupSettings, setGroupSettings] = useState<GroupSettings>(dbService.getSettings());

  const refreshData = () => {
    setMembers(dbService.getUsers());
    setNotices(dbService.getNotices());
    setMessages(dbService.getMessages());
    setNotifications(dbService.getNotifications());
    setGroupSettings(dbService.getSettings());
  };

  useEffect(() => {
    dbService.init();
    refreshData();
    
    // Global storage event listener to simulate Socket.io / Real-time behavior
    const handleStorageChange = () => {
      console.log("Real-time update triggered...");
      refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    const savedSession = localStorage.getItem('group_sync_session');
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('group_sync_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('group_sync_session');
    setActiveTab('directory');
  };

  const handleAddUser = (user: User) => {
    dbService.saveUser(user);
    refreshData();
  };

  const handleDeleteUser = (id: string) => {
    dbService.deleteUser(id);
    refreshData();
  };

  const handleAddNotice = (notice: Notice) => {
    dbService.addNotice(notice);
    refreshData();
  };

  const handleDeleteNotice = (id: string) => {
    dbService.deleteNotice(id);
    refreshData();
  };

  const handleUpdateAdmin = (email: string, pass: string) => {
    if (!currentUser) return;
    const updatedAdmin = { ...currentUser, email, password: pass };
    dbService.saveUser(updatedAdmin);
    setCurrentUser(updatedAdmin);
    localStorage.setItem('group_sync_session', JSON.stringify(updatedAdmin));
    refreshData();
  };

  const handleUpdateSettings = (name: string, logo: string | null, website: string | null) => {
    const newSettings = { name, logo, website };
    dbService.saveSettings(newSettings);
    setGroupSettings(newSettings);
    refreshData();
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;
    const msg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toISOString()
    };
    dbService.addMessage(msg);
    refreshData();
  };

  const clearNotifications = () => {
    dbService.markNotificationsRead();
    refreshData();
  };

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      notifications={notifications}
      onClearNotifications={clearNotifications}
      settings={groupSettings}
    >
      {activeTab === 'directory' && <MemberDirectory members={members} />}
      {activeTab === 'notices' && <NoticeBoard notices={notices} />}
      {activeTab === 'chat' && (
        <div className="h-[calc(100vh-12rem)] min-h-[500px]">
          <ChatRoom currentUser={currentUser} messages={messages} onSendMessage={handleSendMessage} />
        </div>
      )}
      {activeTab === 'admin' && (
        currentUser ? (
          <AdminPanel 
            currentUser={currentUser}
            members={members} 
            notices={notices} 
            onAddUser={handleAddUser} 
            onDeleteUser={handleDeleteUser} 
            onAddNotice={handleAddNotice}
            onDeleteNotice={handleDeleteNotice}
            onUpdateAdmin={handleUpdateAdmin}
            settings={groupSettings}
            onUpdateSettings={handleUpdateSettings}
          />
        ) : (
          <Auth onLogin={handleLogin} availableUsers={members} />
        )
      )}
    </Layout>
  );
};

export default App;
