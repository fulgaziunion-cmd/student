
import React from 'react';
import { User, Message } from '../types';

interface ChatRoomProps {
  currentUser: User | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ currentUser, messages, onSendMessage }) => {
  const [inputText, setInputText] = React.useState('');
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded-2xl border border-slate-200">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <p className="text-slate-600 font-bold mb-2">গ্রুপ চ্যাটে মেসেজ পাঠাতে অ্যাডমিন লগইন প্রয়োজন</p>
        <p className="text-sm text-slate-400">মেসেজগুলো পড়ার জন্য আপনি এখনো এক্সেস করতে পারছেন।</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
        <div>
          <h2 className="font-bold text-slate-800">গ্রুপ চ্যাট (Real-time)</h2>
          <p className="text-xs text-slate-400">সকল সদস্যদের জন্য উন্মুক্ত মেসেজিং</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] text-green-600 font-bold">অনলাইন</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUser?.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-500">{msg.senderName}</span>
                <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                isOwn ? 'bg-red-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="এখানে আপনার মেসেজ লিখুন..."
          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
        />
        <button 
          type="submit"
          disabled={!inputText.trim()}
          className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          পাঠান
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
