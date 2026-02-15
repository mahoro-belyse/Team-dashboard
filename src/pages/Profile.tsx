import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/services/fakeApi';
import { Mail, Building, Calendar, Edit, X, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await api.updateUser(user.id, { name, email });
      updateCurrentUser({ name, email });
      setShowEdit(false);
    } catch {} finally { setSaving(false); }
  };

  if (!user) return null;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Profile</h1></div>

      <div className="max-w-2xl rounded-xl border border-border bg-card p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl font-bold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{user.role}</span>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center justify-center sm:justify-start gap-2"><Mail className="h-4 w-4" />{user.email}</p>
              <p className="flex items-center justify-center sm:justify-start gap-2"><Building className="h-4 w-4" />{user.department}</p>
              <p className="flex items-center justify-center sm:justify-start gap-2"><Calendar className="h-4 w-4" />Joined {user.joinedAt}</p>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowEdit(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="max-w-2xl rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Activity Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-muted p-4"><p className="text-2xl font-bold text-foreground">12</p><p className="text-xs text-muted-foreground">Tasks Completed</p></div>
          <div className="rounded-lg bg-muted p-4"><p className="text-2xl font-bold text-foreground">3</p><p className="text-xs text-muted-foreground">Active Projects</p></div>
          <div className="rounded-lg bg-muted p-4"><p className="text-2xl font-bold text-foreground">28</p><p className="text-xs text-muted-foreground">Contributions</p></div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEdit(false)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Edit Profile</h2>
              <button onClick={() => setShowEdit(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" required /></div>
              <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" required /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<Save className="h-4 w-4 mr-2" /> Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
