
import React from 'react';
import { User, BloodGroup } from '../types';

interface MemberDirectoryProps {
  members: User[];
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({ members }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [bloodFilter, setBloodFilter] = React.useState<string>('');

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlood = bloodFilter === '' || m.bloodGroup === bloodFilter;
    return matchesSearch && matchesBlood;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 self-start">সদস্য তালিকা</h2>
        <div className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            placeholder="নাম অথবা পদবী দিয়ে খুঁজুন..."
            className="flex-1 md:w-64 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
          >
            <option value="">সব রক্তের গ্রুপ</option>
            {Object.values(BloodGroup).map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{member.name}</h3>
                  <p className="text-sm text-slate-500">{member.designation}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-bold">
                {member.bloodGroup}
              </span>
            </div>
            
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {member.mobile}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {member.email}
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-2">{member.address}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredMembers.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            আপনার অনুসন্ধান অনুযায়ী কোনো সদস্য পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDirectory;
