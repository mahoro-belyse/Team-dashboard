import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFakeApi } from '@/hooks/useFakeApi';
import * as api from '@/services/fakeApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Loader2, AlertCircle, RefreshCw, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const tabs = ['Profile', 'Security', 'Preferences', 'Admin'];

const Settings: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [notifPref, setNotifPref] = useLocalStorage('notifPref', { email: true, push: true });

  // Profile
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Security
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMsg, setSecurityMsg] = useState('');
  const [securityError, setSecurityError] = useState('');

  // Admin
  const usersApi = useFakeApi(api.getUsers, [], user?.role === 'admin');
  const [adminLoading, setAdminLoading] = useState<string | null>(null);

  const handleProfileSave = async () => {
    if (!user) return;
    setProfileSaving(true);
    try {
      await api.updateUser(user.id, { name, email });
      updateCurrentUser({ name, email });
      setProfileMsg('Profile updated successfully.');
    } catch { setProfileMsg('Failed to update profile.'); }
    finally { setProfileSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSecurityLoading(true);
    setSecurityError('');
    setSecurityMsg('');
    try {
      const msg = await api.changePassword(user.id, oldPass, newPass);
      setSecurityMsg(msg);
      setOldPass(''); setNewPass('');
    } catch (e: any) { setSecurityError(e.message); }
    finally { setSecurityLoading(false); }
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const handleDeleteUser = async (id: string) => {
    setAdminLoading(id);
    try { await api.deleteUser(id); await usersApi.execute(); } catch {}
    finally { setAdminLoading(null); }
  };

  const handleRoleChange = async (id: string, role: string) => {
    setAdminLoading(id);
    try { await api.updateUser(id, { role: role as any }); await usersApi.execute(); } catch {}
    finally { setAdminLoading(null); }
  };

  const showAdmin = user?.role === 'admin';

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Settings</h1><p className="text-sm text-muted-foreground mt-1">Manage your account</p></div>

      <div className="flex gap-1 border-b border-border">
        {tabs.filter(t => t !== 'Admin' || showAdmin).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >{t}</button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <div className="max-w-lg rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('') || '?'}
            </div>
            <div><p className="font-semibold text-foreground">{user?.name}</p><p className="text-sm text-muted-foreground">{user?.role}</p></div>
          </div>
          <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
          <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} className="mt-1" /></div>
          {profileMsg && <p className="text-sm text-success">{profileMsg}</p>}
          <Button onClick={handleProfileSave} disabled={profileSaving}>{profileSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" /> Save Changes</Button>
        </div>
      )}

      {activeTab === 'Security' && (
        <div className="max-w-lg rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div><Label>Current Password</Label><Input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} className="mt-1" required /></div>
            <div><Label>New Password</Label><Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="mt-1" required /></div>
            {securityError && <p className="text-sm text-destructive">{securityError}</p>}
            {securityMsg && <p className="text-sm text-success">{securityMsg}</p>}
            <Button type="submit" disabled={securityLoading}>{securityLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Update Password</Button>
          </form>
        </div>
      )}

      {activeTab === 'Preferences' && (
        <div className="max-w-lg rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Theme</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Current: {theme}</p>
              <Button variant="outline" size="sm" onClick={toggleTheme}>Toggle {theme === 'light' ? 'Dark' : 'Light'}</Button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={notifPref.email} onChange={e => setNotifPref({ ...notifPref, email: e.target.checked })} className="rounded border-border" />
                <span className="text-foreground">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={notifPref.push} onChange={e => setNotifPref({ ...notifPref, push: e.target.checked })} className="rounded border-border" />
                <span className="text-foreground">Push notifications</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Admin' && showAdmin && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">User Management</h3>
          {usersApi.loading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : usersApi.error ? (
            <div className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-destructive" /><p className="text-sm text-destructive">{usersApi.error}</p><Button size="sm" onClick={usersApi.retry}><RefreshCw className="h-4 w-4" /></Button></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left"><th className="py-3 pr-4 font-medium text-muted-foreground">Name</th><th className="py-3 pr-4 font-medium text-muted-foreground">Email</th><th className="py-3 pr-4 font-medium text-muted-foreground">Role</th><th className="py-3 font-medium text-muted-foreground">Actions</th></tr></thead>
                <tbody>
                  {(usersApi.data || []).map(u => (
                    <tr key={u.id} className="border-b border-border">
                      <td className="py-3 pr-4 text-foreground">{u.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                      <td className="py-3 pr-4">
                        <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} className="rounded border border-input bg-background px-2 py-1 text-xs" disabled={adminLoading === u.id}>
                          <option value="admin">Admin</option><option value="manager">Manager</option><option value="member">Member</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <button onClick={() => handleDeleteUser(u.id)} disabled={adminLoading === u.id || u.id === user?.id} className="text-destructive hover:text-destructive/80 disabled:opacity-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
