
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Bell, Check, Trash, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
    
    // Set up realtime subscription for new notifications
    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          
          toast({
            title: newNotification.title,
            description: newNotification.content.substring(0, 60) + (newNotification.content.length > 60 ? '...' : ''),
          });
        }
      )
      .subscribe();
      
    // Handle connection issues with reconnect logic
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    
    const reconnect = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          console.log(`Attempting to reconnect realtime subscription (${reconnectAttempts + 1}/${maxReconnectAttempts})...`);
          channel.subscribe();
          reconnectAttempts++;
        }, 3000 * Math.pow(2, reconnectAttempts)); // Exponential backoff
      }
    };
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notifications. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notification as read.",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', session.user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
      
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark all notifications as read.",
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setNotifications((prev) => 
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notification.",
      });
    }
  };
  
  const formatNotificationTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(notification => !notification.is_read);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        
        <Button 
          variant="outline"
          onClick={markAllAsRead}
          disabled={!notifications.some(n => !n.is_read)}
        >
          <Check className="mr-2 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>
      
      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {notifications.filter(n => !n.is_read).length > 0 && (
                <Badge variant="default" className="ml-1.5">
                  {notifications.filter(n => !n.is_read).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          {renderNotifications()}
        </TabsContent>
        
        <TabsContent value="unread" className="space-y-4">
          {renderNotifications()}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderNotifications() {
    if (loading) {
      return [...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ));
    }
    
    if (filteredNotifications.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium">No notifications</h3>
          <p className="text-muted-foreground mt-1">
            {filter === 'all' ? "You don't have any notifications yet." : "You don't have any unread notifications."}
          </p>
        </div>
      );
    }
    
    return filteredNotifications.map((notification) => (
      <Card 
        key={notification.id} 
        className={`hover:bg-muted/50 transition-colors ${notification.is_read ? '' : 'bg-muted/30 border-l-4 border-l-primary'}`}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              notification.is_read ? 'bg-secondary' : 'bg-primary/10'
            }`}>
              <Bell className={`h-5 w-5 ${notification.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
            </div>
            
            <div className="flex-1">
              <h3 className={`font-medium mb-1 ${notification.is_read ? '' : 'text-primary'}`}>
                {notification.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-2">
                {notification.content}
              </p>
              <div className="text-xs text-muted-foreground">
                {formatNotificationTime(notification.created_at)}
              </div>
            </div>
            
            <div className="flex space-x-2 flex-shrink-0">
              {!notification.is_read && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => deleteNotification(notification.id)}
                title="Delete notification"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  }
}
