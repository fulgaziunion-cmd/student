
import React from 'react';
import { Notice } from '../types';

interface NoticeBoardProps {
  notices: Notice[];
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">নোটিশ বোর্ড</h2>
      </div>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">এখন পর্যন্ত কোনো নোটিশ প্রকাশিত হয়নি।</p>
            <p className="text-sm text-slate-400">অ্যাডমিন নতুন কোনো আপডেট দিলে তা এখানে দেখা যাবে।</p>
          </div>
        ) : (
          notices.map((notice) => (
            <article key={notice.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all">
              <header className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900">{notice.title}</h3>
                <span className="text-sm text-slate-400">{new Date(notice.date).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </header>
              <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                {notice.content}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
