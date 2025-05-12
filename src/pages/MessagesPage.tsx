import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Send, Info, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  order_id: string | null;
  is_read: boolean;
  created_at: string;
  sender?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  receiver?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Conversation {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<{
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
  } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
      const messagesSubscription = supabase
        .channel('public:messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        }, (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === currentUserId || newMsg.receiver_id === currentUserId) &&
            (newMsg.sender_id === selectedUser || newMsg.receiver_id === selectedUser)
          ) {
            fetchMessages(selectedUser);
          } else if (newMsg.receiver_id === currentUserId) {
            fetchConversations();
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(messagesSubscription);
      };
    }
  }, [currentUserId, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAuthStatus = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to view your messages",
      });
      navigate('/auth');
      return;
    }
    setCurrentUserId(data.session.user.id);
  };

  const fetchConversations = async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      
      // Get all messages where the current user is either sender or receiver
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(username, full_name, avatar_url),
          receiver:profiles!receiver_id(username, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });
        
      if (messagesError) throw messagesError;
      
      if (!messagesData || messagesData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }
      
      // Process messages to create conversation list
      const conversationsMap = new Map<string, Conversation>();
      
      messagesData.forEach((message: any) => {
        // Determine the other user in the conversation
        const isUserSender = message.sender_id === currentUserId;
        const otherUserId = isUserSender ? message.receiver_id : message.sender_id;
        const otherUserData = isUserSender ? message.receiver : message.sender;
        
        if (!otherUserId || !otherUserData) return;
        
        const existingConversation = conversationsMap.get(otherUserId);
        
        // Count unread messages
        const isUnread = !message.is_read && message.receiver_id === currentUserId;
        
        if (existingConversation) {
          // Update only if this message is newer
          const existingDate = new Date(existingConversation.lastMessageDate).getTime();
          const messageDate = new Date(message.created_at).getTime();
          
          if (messageDate > existingDate) {
            existingConversation.lastMessage = message.content;
            existingConversation.lastMessageDate = message.created_at;
          }
          
          if (isUnread) {
            existingConversation.unreadCount += 1;
          }
        } else {
          // Create new conversation entry
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            username: otherUserData.username,
            fullName: otherUserData.full_name,
            avatarUrl: otherUserData.avatar_url,
            lastMessage: message.content,
            lastMessageDate: message.created_at,
            unreadCount: isUnread ? 1 : 0
          });
        }
      });
      
      // Sort conversations by last message date
      const sortedConversations = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime());
      
      setConversations(sortedConversations);
      
      // If no conversation is selected yet and we have conversations, select the first one
      if (!selectedUser && sortedConversations.length > 0) {
        setSelectedUser(sortedConversations[0].userId);
        setSelectedUserDetails({
          username: sortedConversations[0].username,
          fullName: sortedConversations[0].fullName,
          avatarUrl: sortedConversations[0].avatarUrl
        });
        fetchMessages(sortedConversations[0].userId);
      }
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load conversations. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    if (!currentUserId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(username, full_name, avatar_url),
          receiver:profiles!receiver_id(username, full_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark received messages as read
      const unreadMessages = data
        ?.filter(msg => msg.receiver_id === currentUserId && !msg.is_read)
        .map(msg => msg.id);
      
      if (unreadMessages && unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessages);
          
        // Refresh conversations list to update unread counts
        fetchConversations();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages. Please try again.",
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUserId || !selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: currentUserId,
          receiver_id: selectedUser,
          is_read: false
        });
      
      if (error) throw error;
      
      setNewMessage('');
      
      // Fetch updated message list
      fetchMessages(selectedUser);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  };
  
  const selectConversation = (userId: string, username: string, fullName: string | null, avatarUrl: string | null) => {
    setSelectedUser(userId);
    setSelectedUserDetails({
      username,
      fullName,
      avatarUrl
    });
    fetchMessages(userId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      // Today, show time only
      return format(messageDate, 'h:mm a');
    } else {
      // Not today, show date and time
      return format(messageDate, 'MMM d, h:mm a');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
      </div>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[300px_1fr] h-[calc(100vh-220px)]">
          {/* Conversations list */}
          <div className="border-r">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Manage your conversations with clients and sellers</CardDescription>
            </CardHeader>
            
            <div className="px-4 pb-4">
              <ScrollArea className="h-[calc(100vh-320px)]">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations.length > 0 ? (
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <div 
                        key={conversation.userId}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer relative ${
                          selectedUser === conversation.userId ? 'bg-muted' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => selectConversation(
                          conversation.userId, 
                          conversation.username, 
                          conversation.fullName, 
                          conversation.avatarUrl
                        )}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatarUrl || ''} alt={conversation.fullName || conversation.username} />
                          <AvatarFallback>
                            {(conversation.fullName?.charAt(0) || conversation.username.charAt(0) || 'U').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-medium text-sm truncate">
                              {conversation.fullName || conversation.username}
                            </h4>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {format(new Date(conversation.lastMessageDate), 'MMM d')}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground h-5 min-w-5 rounded-full flex items-center justify-center text-xs font-medium">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[calc(100vh-320px)] flex-col p-4 text-center">
                    <Info className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium">No conversations yet</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Messages from clients and sellers will appear here
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex flex-col">
            {selectedUser && selectedUserDetails ? (
              <>
                <div className="px-6 py-4 border-b flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUserDetails.avatarUrl || ''} alt={selectedUserDetails.fullName || selectedUserDetails.username} />
                    <AvatarFallback>
                      {(selectedUserDetails.fullName?.charAt(0) || selectedUserDetails.username.charAt(0) || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedUserDetails.fullName || selectedUserDetails.username}</h3>
                    <p className="text-xs text-muted-foreground">@{selectedUserDetails.username}</p>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length > 0 ? (
                      messages.map((message) => {
                        const isCurrentUser = message.sender_id === currentUserId;
                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="flex space-x-2 max-w-[80%]">
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarImage src={message.sender?.avatar_url || ''} alt={message.sender?.full_name || message.sender?.username} />
                                  <AvatarFallback>
                                    {(message.sender?.full_name?.charAt(0) || message.sender?.username.charAt(0) || 'U').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                <div 
                                  className={`px-4 py-2 rounded-lg ${
                                    isCurrentUser 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-secondary'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                </div>
                                <span className="text-xs text-muted-foreground mt-1">
                                  {formatMessageDate(message.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-[calc(100vh-380px)] flex-col">
                        <p className="text-muted-foreground text-sm">
                          No messages yet. Start a conversation!
                        </p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <form 
                  onSubmit={handleSendMessage}
                  className="p-4 border-t flex items-center space-x-2"
                >
                  <Input 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full flex-col">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">Select a conversation</h3>
                <p className="text-muted-foreground text-center max-w-xs mt-2">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
