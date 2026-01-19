
import React from 'react';
import { User, UserRole, AppNotification } from '../types';
import { Icons } from '../constants';
import { GroupSettings } from '../services/dbService';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
  notifications: AppNotification[];
  onClearNotifications: () => void;
  settings: GroupSettings;
}

const Layout: React.FC<LayoutProps> = ({ 
  user, 
  onLogout, 
  activeTab, 
  setActiveTab, 
  children,
  notifications,
  onClearNotifications,
  settings
}) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [isNotifOpen, setNotifOpen] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'directory', label: 'সদস্য তালিকা', icon: Icons.Users },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Icons.Notice },
    { id: 'chat', label: 'গ্রুপ চ্যাট', icon: Icons.Chat },
    { id: 'admin', label: 'অ্যাডমিন প্যানেল', icon: Icons.Dashboard },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-72 bg-white border-r border-slate-200`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shrink-0 overflow-hidden">
               {settings.logo ? (
                 <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-xl font-bold">{settings.name.charAt(0)}</span>
               )}
            </div>
            <h1 className="text-md font-bold text-red-600 leading-tight">
              {settings.name}
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-red-50 text-red-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon />
              {item.label}
            </button>
          ))}

          {/* Website Button for all members */}
          {settings.website && (
            <div className="px-4 py-4 mt-4 border-t border-slate-100">
              <a 
                href={settings.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                ভিজিট ওয়েবসাইট
              </a>
            </div>
          )}
        </nav>

        {user && (
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Icons.Logout />
              লগআউট
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <button 
            className="md:hidden p-2 -ml-2 text-slate-500"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => { setNotifOpen(!isNotifOpen); if(!isNotifOpen) onClearNotifications(); }}
                className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold">নোটিফিকেশন</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">নতুন কোনো বার্তা নেই</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <p className="text-sm text-slate-800">{n.message}</p>
                          <p className="text-xs text-slate-400 mt-1">এখনই</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </section>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)}></div>
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="p-6 flex justify-between items-center">
               <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white overflow-hidden">
                   {settings.logo ? <img src={settings.logo} className="w-full h-full object-cover" /> : settings.name.charAt(0)}
                </div>
                <h1 className="text-md font-bold text-red-600 leading-tight">{settings.name}</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-red-50 text-red-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon />
                  {item.label}
                </button>
              ))}
              
              {settings.website && (
                <a 
                  href={settings.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold bg-red-600 text-white mt-4"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  ভিজিট ওয়েবসাইট
                </a>
              )}
            </nav>
            {user && (
              <div className="p-4 border-t border-slate-200">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Icons.Logout />
                  লগআউট
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default Layout;
