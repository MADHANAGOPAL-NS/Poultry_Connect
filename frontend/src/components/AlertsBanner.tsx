import { useState, useEffect } from 'react';
import { AlertTriangle, X, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HealthAlert {
  id: string;
  health_status: string;
  stress_level: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AlertsBanner = () => {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  useEffect(() => {
    fetchAlerts();
    
    // Polling every 30 seconds since realtime channels are removed
    const interval = setInterval(() => {
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/alerts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Just mocking the unread alerts filter for the UI
        const unread = data.filter((d: any) => !d.isRead && !d.is_read);
        if (unread.length > 0) {
          setAlerts(unread as HealthAlert[]);
          setShowAlerts(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const dismissAlert = async (id: string) => {
    // In a real app we would POST/PUT to /api/alerts/:id/read
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const unreadCount = alerts.length;

  if (unreadCount === 0 && !showAlerts) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        className="relative bg-background shadow-lg"
        onClick={() => setShowAlerts(!showAlerts)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground h-5 w-5 flex items-center justify-center p-0 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showAlerts && alerts.length > 0 && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-background border rounded-lg shadow-xl">
          <div className="p-3 border-b font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Critical Health Alerts
          </div>
          {alerts.map(alert => (
            <div key={alert.id} className="p-3 border-b last:border-b-0 flex gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={alert.health_status === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                    {alert.health_status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{alert.message}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => dismissAlert(alert.id)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsBanner;
