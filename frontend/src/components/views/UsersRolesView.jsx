import React, { useState } from 'react';
import { Users, Shield, UserPlus, Mail, CheckCircle2, MoreVertical } from 'lucide-react';

export default function UsersRolesView() {
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Dr. Aris Thorne', email: 'aris.thorne@biointel.org', role: 'Principal Ecologist', access: 'ADMIN', status: 'ACTIVE', lastActive: '10 mins ago' },
    { id: 2, name: 'Maya Lin', email: 'maya.lin@biointel.org', role: 'Bioacoustic Analyst', access: 'RESEARCHER', status: 'ACTIVE', lastActive: '1 hour ago' },
    { id: 3, name: 'Dr. Evelyn Vance', email: 'evelyn.vance@biointel.org', role: 'eDNA Lead Scientist', access: 'RESEARCHER', status: 'ACTIVE', lastActive: 'Yesterday' },
    { id: 4, name: 'Kavita Rao', email: 'kavita.rao@wildlife.gov', role: 'Sanctuary Field Ranger', access: 'FIELD_PATROL', status: 'ACTIVE', lastActive: '3 hours ago' },
    { id: 5, name: 'Tenzing Norgay Eco-Team', email: 'patrol.alpha@biointel.org', role: 'Drone & Camera Network', access: 'CONTRIBUTOR', status: 'ACTIVE', lastActive: 'Active now' },
  ]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <Users className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Users, Field Rangers & Team Roles (RBAC)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Role-Based Access Control across Ecologists, Field Observers, Data Engineers, and External Auditors
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs self-start md:self-auto">
          <UserPlus className="h-4 w-4" /> Add Team Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
            <tr>
              <th className="p-3.5">Name & Email</th>
              <th className="p-3.5">Assigned Role</th>
              <th className="p-3.5">Access Level</th>
              <th className="p-3.5">Last Active</th>
              <th className="p-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{u.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {u.email}
                  </div>
                </td>
                <td className="p-3.5 font-medium text-slate-700">{u.role}</td>
                <td className="p-3.5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md font-mono ${
                    u.access === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                    u.access === 'RESEARCHER' ? 'bg-cyan-100 text-cyan-700 border border-cyan-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {u.access}
                  </span>
                </td>
                <td className="p-3.5 text-slate-500 font-mono text-[11px]">{u.lastActive}</td>
                <td className="p-3.5 text-right">
                  <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700">
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
