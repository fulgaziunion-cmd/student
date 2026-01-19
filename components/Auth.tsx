
import React from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  availableUsers: User[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, availableUsers }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = availableUsers.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="flex items-center justify-center p-6 min-h-[500px]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg shadow-red-200">
            A
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">অ্যাডমিন লগইন</h1>
          <p className="text-slate-500 font-medium">প্যানেল এক্সেস করতে তথ্য প্রদান করুন</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">ইমেইল ঠিকানা</label>
            <input 
              required
              type="email" 
              placeholder="subokhan50s@gmail.com"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-300"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-1 relative">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">পাসওয়ার্ড</label>
            <div className="relative">
              <input 
                required
                type={showPass ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-300 pr-14"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 hover:shadow-xl transition-all active:scale-95"
            >
              লগইন করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
