import React, { useState } from 'react';
import { useFakeApi } from '@/hooks/useFakeApi';
import * as api from '@/services/fakeApi';
import { Loader2, AlertCircle, RefreshCw, Bell, CheckCircle, Archive, AlertTriangle, MessageSquare, TrendingUp, ClipboardList, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.FC<any>> = {
  ClipboardList, TrendingUp, AlertTriangle, MessageSquare, CheckCircle, Info, Bell,
};

const Notifications: React.FC = () => {
  const { data: notifications, loading, error, retry, execute: reload } = useFakeApi(api.getNotifications);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <AlertCircle className="h-10 w-10 text-destructive" /><p className="text-sm text-destructive">{error}</p>
      <Button onClick={retry}><RefreshCw className="h-4 w-4 mr-2" /> Retry</Button>
    </div>
  );

  const active = (notifications || []).filter(n => !n.archived);
  const unreadCount = active.filter(n => !n.read).length;

  const handleRead = async (id: string) => {
    setActionLoading(id);
    await api.markNotificationRead(id);
    await reload();
    setActionLoading(null);
  };

  const handleArchive = async (id: string) => {
    setActionLoading(id);
    await api.archiveNotification(id);
    await reload();
    setActionLoading(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">{unreadCount} unread</p>
        </div>
        <div className="flex h-8 min-w-[32px] items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold px-2">{unreadCount}</div>
      </div>

      <div className="space-y-2">
        {active.map(n => {
          const Icon = iconMap[n.icon] || Bell;
          return (
            <div key={n.id} className={`flex items-start gap-4 rounded-xl border border-border p-4 transition-colors ${!n.read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${n.type === 'success' ? 'bg-success/10 text-success' : n.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!n.read && (
                  <button onClick={() => handleRead(n.id)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground" title="Mark as read" disabled={actionLoading === n.id}>
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => handleArchive(n.id)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground" title="Archive" disabled={actionLoading === n.id}>
                  <Archive className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        {active.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No notifications.</p>}
      </div>
    </div>
  );
};

export default Notifications;
