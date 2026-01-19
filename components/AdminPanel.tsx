
import React from 'react';
import { User, UserRole, BloodGroup, Notice } from '../types';
import { Icons } from '../constants';
import { geminiService } from '../services/geminiService';
import { GroupSettings } from '../services/dbService';

interface AdminPanelProps {
  currentUser: User;
  members: User[];
  notices: Notice[];
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onAddNotice: (notice: Notice) => void;
  onDeleteNotice: (id: string) => void;
  onUpdateAdmin: (email: string, pass: string) => void;
  settings: GroupSettings;
  onUpdateSettings: (name: string, logo: string | null, website: string | null) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentUser, members, notices, onAddUser, onDeleteUser, onAddNotice, onDeleteNotice, onUpdateAdmin, settings, onUpdateSettings 
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState<'members' | 'notices' | 'settings'>('members');
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isPolishing, setIsPolishing] = React.useState(false);

  const [userData, setUserData] = React.useState<Partial<User>>({
    name: '', email: '', mobile: '', address: '', bloodGroup: BloodGroup.O_POSITIVE, designation: '', role: UserRole.MEMBER
  });
  const [noticeData, setNoticeData] = React.useState({ title: '', content: '' });
  
  const [adminSettings, setAdminSettings] = React.useState({ email: currentUser.email, password: currentUser.password || '' });
  const [groupName, setGroupName] = React.useState(settings.name);
  const [groupLogo, setGroupLogo] = React.useState<string | null>(settings.logo);
  const [groupWebsite, setGroupWebsite] = React.useState(settings.website || '');
  const [showPass, setShowPass] = React.useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      ...(userData as User),
      id: Math.random().toString(36).substr(2, 9),
      password: 'password123'
    };
    onAddUser(newUser);
    setUserData({ name: '', email: '', mobile: '', address: '', bloodGroup: BloodGroup.O_POSITIVE, designation: '', role: UserRole.MEMBER });
    setModalOpen(false);
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: Notice = {
      id: Math.random().toString(36).substr(2, 9),
      title: noticeData.title,
      content: noticeData.content,
      date: new Date().toISOString(),
      authorId: 'admin'
    };
    onAddNotice(newNotice);
    setNoticeData({ title: '', content: '' });
    setModalOpen(false);
  };

  const handleUpdateEverything = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAdmin(adminSettings.email, adminSettings.password);
    onUpdateSettings(groupName, groupLogo, groupWebsite);
    alert('সকল তথ্য সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const polishAnnouncement = async () => {
    if (!noticeData.content) return;
    setIsPolishing(true);
    const polished = await geminiService.polishNotice(noticeData.content);
    setNoticeData(prev => ({ ...prev, content: polished }));
    setIsPolishing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">অ্যাডমিন ড্যাশবোর্ড</h2>
        <div className="flex bg-white border border-slate-200 rounded-lg p-1 overflow-x-auto w-full md:w-auto">
          <button 
            onClick={() => setActiveSubTab('members')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeSubTab === 'members' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            সদস্য ব্যবস্থাপনা
          </button>
          <button 
            onClick={() => setActiveSubTab('notices')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeSubTab === 'notices' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            নোটিশ ব্যবস্থাপনা
          </button>
          <button 
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeSubTab === 'settings' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            জেনারেল সেটিংস
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">মোট সদস্য</p>
            <p className="text-3xl font-bold text-slate-900">{members.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm font-medium">প্রকাশিত নোটিশ</p>
            <p className="text-3xl font-bold text-slate-900">{notices.length}</p>
          </div>
          {activeSubTab !== 'settings' && (
            <button 
              onClick={() => setModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all"
            >
              <Icons.Plus />
              {activeSubTab === 'members' ? 'নতুন সদস্য যুক্ত করুন' : 'নোটিশ লিখুন'}
            </button>
          )}
        </div>

        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden min-h-[400px]">
          {activeSubTab === 'members' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">নাম</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">পদবী</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map(member => (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">{member.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button onClick={() => onDeleteUser(member.id)} className="p-1 hover:bg-red-50 rounded transition-colors">
                          <Icons.Trash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeSubTab === 'notices' && (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">শিরোনাম</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">তারিখ</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notices.map(notice => (
                    <tr key={notice.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{notice.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">{new Date(notice.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <button onClick={() => onDeleteNotice(notice.id)} className="p-1 hover:bg-red-50 rounded transition-colors">
                          <Icons.Trash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSubTab === 'settings' && (
            <div className="p-8 max-w-2xl mx-auto overflow-y-auto max-h-[70vh]">
              <h3 className="text-xl font-bold mb-6 text-slate-800 border-b pb-2">গ্রুপ ও অ্যাডমিন প্রোফাইল সেটিংস</h3>
              <form onSubmit={handleUpdateEverything} className="space-y-6">
                
                {/* Group Settings Section */}
                <div className="space-y-4 p-4 bg-red-50/30 rounded-xl border border-red-100">
                  <h4 className="font-bold text-sm text-red-600 uppercase tracking-wider">গ্রুপ ইনফরমেশন</h4>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">গ্রুপের নাম</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">ওয়েবসাইট লিংক (URL)</label>
                    <input 
                      type="url" 
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      value={groupWebsite}
                      onChange={e => setGroupWebsite(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-400 mt-1">* এই লিংকটি সকল সদস্য তাদের সাইডবারে দেখতে পাবে।</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">গ্রুপ লোগো</label>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center text-slate-300">
                        {groupLogo ? <img src={groupLogo} className="w-full h-full object-cover" /> : <Icons.Plus />}
                      </div>
                      <label className="cursor-pointer bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                        লোগো পরিবর্তন করুন
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Login Settings Section */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-sm text-red-600 uppercase tracking-wider">অ্যাডমিন লগইন এক্সেস</h4>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">অ্যাডমিন ইমেইল</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      value={adminSettings.email}
                      onChange={e => setAdminSettings({...adminSettings, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="text-xs font-bold text-slate-500 uppercase">অ্যাডমিন পাসওয়ার্ড</label>
                    <div className="relative">
                      <input 
                        required
                        type={showPass ? "text" : "password"} 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none pr-10"
                        value={adminSettings.password}
                        onChange={e => setAdminSettings({...adminSettings, password: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPass ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                  সেভ এবং আপডেট করুন
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-xl">{activeSubTab === 'members' ? 'নতুন সদস্য ফরম' : 'নতুন নোটিশ ফরম'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={activeSubTab === 'members' ? handleAddMember : handleAddNotice} className="p-6 space-y-4">
              {activeSubTab === 'members' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">সম্পূর্ণ নাম</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={userData.name}
                        onChange={e => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">ইমেইল</label>
                      <input 
                        required
                        type="email" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={userData.email}
                        onChange={e => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">মোবাইল</label>
                      <input 
                        required
                        type="tel" 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={userData.mobile}
                        onChange={e => setUserData({...userData, mobile: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">রক্তের গ্রুপ</label>
                      <select 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        value={userData.bloodGroup}
                        onChange={e => setUserData({...userData, bloodGroup: e.target.value as BloodGroup})}
                      >
                        {Object.values(BloodGroup).map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">পদবী</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      value={userData.designation}
                      onChange={e => setUserData({...userData, designation: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">ঠিকানা</label>
                    <textarea 
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-20"
                      value={userData.address}
                      onChange={e => setUserData({...userData, address: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">শিরোনাম</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      placeholder="জরুরি ঘোষণা..."
                      value={noticeData.title}
                      onChange={e => setNoticeData({...noticeData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase">বিষয়বস্তু</label>
                      <button 
                        type="button"
                        onClick={polishAnnouncement}
                        disabled={isPolishing || !noticeData.content}
                        className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 disabled:opacity-50 transition-all font-bold uppercase tracking-tight flex items-center gap-1"
                      >
                        {isPolishing ? 'চিন্তা করছি...' : '✨ এআই দিয়ে পালিশ করুন'}
                      </button>
                    </div>
                    <textarea 
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-32"
                      placeholder="বিস্তারিত লিখুন..."
                      value={noticeData.content}
                      onChange={e => setNoticeData({...noticeData, content: e.target.value})}
                    />
                  </div>
                </>
              )}
              
              <div className="pt-4">
                <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-xl font-bold hover:bg-red-700 transition-all">
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
