import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserCheck, 
  Shield, 
  Mail, 
  User as UserIcon, 
  Loader2, 
  CheckCircle2, 
  Clock,
  KeyRound
} from 'lucide-react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function AdminUsers() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search by ID state
  const [searchId, setSearchId] = useState('');
  const [foundUser, setFoundUser] = useState(null);

  // Modify form state
  const [modifyForm, setModifyForm] = useState({
    userId: '',
    username: '',
    email: '',
    role: 'CUSTOMER'
  });

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!searchId) {
      showToast('Please enter a User ID', 'error');
      return;
    }

    setSearchLoading(true);
    try {
      const user = await api.admin.users.getById(searchId);
      if (user) {
        setFoundUser(user);
        setModifyForm({
          userId: user.userId,
          username: user.username || '',
          email: user.email || '',
          role: user.role || 'CUSTOMER'
        });
        showToast(`User "${user.username}" found!`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'User not found with this ID', 'error');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleModifyUser = async (e) => {
    e.preventDefault();
    if (!modifyForm.userId) {
      showToast('User ID is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.admin.users.modify(
        modifyForm.userId,
        modifyForm.username,
        modifyForm.email,
        modifyForm.role
      );
      showToast(`User #${res.userId} modified successfully!`, 'success');
      setFoundUser(res);
    } catch (err) {
      showToast(err.message || 'Failed to modify user', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: User Lookup (1 col) */}
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Lookup User</h3>
              <p className="text-xs text-slate-400">Search customer or administrator accounts</p>
            </div>
          </div>

          <form onSubmit={handleLookup} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                User ID
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  placeholder="e.g. 1"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={searchLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {searchLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Find User Details</span>
                </>
              )}
            </button>
          </form>

          {/* User Preview Card if Found */}
          {foundUser && (
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Profile Details
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  foundUser.role === 'ADMIN'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {foundUser.role}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-white">{foundUser.username}</span>
                  <span className="text-slate-500">(ID #{foundUser.userId})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{foundUser.email}</span>
                </div>
                {foundUser.createdAt && (
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-1 border-t border-slate-800/80">
                    <Clock className="w-3 h-3" />
                    <span>Member since {new Date(foundUser.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: User Modification Form (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Modify User & Roles</h3>
              <p className="text-xs text-slate-400">Update account credentials and permission levels</p>
            </div>
          </div>

          <form onSubmit={handleModifyUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  User ID to Modify *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1"
                  value={modifyForm.userId}
                  onChange={(e) => setModifyForm({ ...modifyForm, userId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="New or existing username"
                  value={modifyForm.username}
                  onChange={(e) => setModifyForm({ ...modifyForm, username: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={modifyForm.email}
                onChange={(e) => setModifyForm({ ...modifyForm, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                System Role Assignment
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModifyForm({ ...modifyForm, role: 'CUSTOMER' })}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    modifyForm.role === 'CUSTOMER'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>CUSTOMER</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModifyForm({ ...modifyForm, role: 'ADMIN' })}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    modifyForm.role === 'ADMIN'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>ADMIN (Full Privileges)</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Apply User Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
