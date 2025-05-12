
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Search, Send, MoreHorizontal, Clock } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  order_id: string | null;
  is_read: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user.id);
        fetchContacts(session.user.id);
      }
    };

    fetchCurrentUser();
  }, []);

  // Establish realtime subscription
  useEffect(() => {
    if (!currentUser) return;

    const setupRealtimeSubscription = () => {
      const channel = supabase
        .channel('messages-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${currentUser}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            
            // Update messages if the current conversation is open
            if (selectedContact && newMessage.sender_id === selectedContact.id) {
              setMessages((prev) => [...prev, newMessage]);
              markMessageAsRead(newMessage.id);
            }
            
            // Update contacts with new message info
            updateContactWithNewMessage(newMessage);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    let subscription = setupRealtimeSubscription();
    let reconnectTimer: ReturnType<typeof setTimeout>;
    
    // Reconnect logic for realtime subscription
    const handleConnectionStatus = () => {
      if (reconnectAttempts < 5) {
        reconnectTimer = setTimeout(() => {
          console.log('Attempting to reconnect realtime subscription...');
          subscription = setupRealtimeSubscription();
          setReconnectAttempts(prev => prev + 1);
        }, 3000 * (reconnectAttempts + 1)); // Exponential backoff
      }
    };

    return () => {
      if (subscription && typeof subscription === 'function') {
        subscription();
      }
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [currentUser, selectedContact, reconnectAttempts]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchContacts = async (userId: string) => {
    try {
      // First, get all conversations where the current user is involved
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id, content, created_at, is_read')
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });
      
      if (sentError) throw sentError;
      
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id, content, created_at, is_read')
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false });
      
      if (receivedError) throw receivedError;
      
      // Combine and find unique contacts
      const uniqueContacts = new Map<string, any>();
      
      sentMessages?.forEach(msg => {
        if (!uniqueContacts.has(msg.receiver_id)) {
          uniqueContacts.set(msg.receiver_id, {
            id: msg.receiver_id,
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount: 0
          });
        }
      });
      
      receivedMessages?.forEach(msg => {
        const unreadCount = msg.is_read ? 0 : 1;
        
        if (!uniqueContacts.has(msg.sender_id)) {
          uniqueContacts.set(msg.sender_id, {
            id: msg.sender_id,
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount
          });
        } else {
          // If this is a more recent message, update the last message info
          const existing = uniqueContacts.get(msg.sender_id);
          if (new Date(msg.created_at) > new Date(existing.lastMessageTime)) {
            existing.lastMessage = msg.content;
            existing.lastMessageTime = msg.created_at;
          }
          existing.unreadCount = (existing.unreadCount || 0) + unreadCount;
        }
      });
      
      // Now fetch user info for these contacts
      const contactPromises = Array.from(uniqueContacts.values()).map(async contact => {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url')
          .eq('id', contact.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user info:', userError);
          return {
            ...contact,
            name: 'Unknown User',
            avatar: '',
            status: 'offline' as const
          };
        }
        
        return {
          ...contact,
          name: userData?.full_name || userData?.username || 'Unknown User',
          avatar: userData?.avatar_url || '',
          status: 'online' as const // This would be determined by a separate online status system
        };
      });
      
      const resolvedContacts = await Promise.all(contactPromises);
      setContacts(resolvedContacts.sort((a, b) => 
        new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      ));
      
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load contacts. Please refresh the page.",
      });
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    if (!currentUser) return;
    
    setLoadingMessages(true);
    try {
      // Get messages between current user and selected contact
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${currentUser})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark unread messages as read
      const unreadMessages = data?.filter(msg => 
        msg.receiver_id === currentUser && !msg.is_read
      ) || [];
      
      for (const msg of unreadMessages) {
        await markMessageAsRead(msg.id);
      }
      
      // Update unread count for this contact
      setContacts(contacts => contacts.map(contact => 
        contact.id === contactId ? { ...contact, unreadCount: 0 } : contact
      ));
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages. Please try again.",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !selectedContact) return;
    
    try {
      const newMessageObj = {
        sender_id: currentUser,
        receiver_id: selectedContact.id,
        content: newMessage.trim(),
        is_read: false
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessageObj)
        .select();
      
      if (error) throw error;
      
      setMessages((prev) => [...prev, data[0]]);
      setNewMessage('');
      
      // Update the contact's last message
      setContacts(contacts => contacts.map(contact => 
        contact.id === selectedContact.id 
          ? { 
              ...contact, 
              lastMessage: newMessage.trim(),
              lastMessageTime: new Date().toISOString()
            } 
          : contact
      ));
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const updateContactWithNewMessage = (newMessage: Message) => {
    setContacts(prev => {
      const updatedContacts = [...prev];
      const contactIndex = updatedContacts.findIndex(c => c.id === newMessage.sender_id);
      
      if (contactIndex >= 0) {
        // Update existing contact
        updatedContacts[contactIndex] = {
          ...updatedContacts[contactIndex],
          lastMessage: newMessage.content,
          lastMessageTime: newMessage.created_at,
          unreadCount: 
            selectedContact && selectedContact.id === newMessage.sender_id
              ? updatedContacts[contactIndex].unreadCount || 0
              : (updatedContacts[contactIndex].unreadCount || 0) + 1
        };
      } else {
        // This is a new contact, we should fetch their info
        // In a real app, you'd want to fetch the user info here
        // For simplicity, we'll use placeholder data and handle this in a re-fetch
        fetchContacts(currentUser!);
      }
      
      // Sort by most recent message
      return updatedContacts.sort((a, b) => 
        new Date(b.lastMessageTime || '').getTime() - new Date(a.lastMessageTime || '').getTime()
      );
    });
  };

  const handleContactSelect = (contact: User) => {
    setSelectedContact(contact);
    fetchMessages(contact.id);
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col md:flex-row">
      {/* Contacts sidebar */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-border ${selectedContact ? 'hidden md:block' : ''}`}>
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-auto h-[calc(100%-80px)]">
          {loadingContacts ? (
            <>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4 border-b border-border">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </>
          ) : filteredContacts.length > 0 ? (
            <div>
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className={`flex items-start gap-3 p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                      contact.status === 'online' ? 'bg-green-500' : 
                      contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate" style={{ maxWidth: 'calc(100% - 70px)' }}>
                        {contact.name}
                      </h3>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(contact.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-muted-foreground truncate" style={{ maxWidth: 'calc(100% - 30px)' }}>
                        {contact.lastMessage}
                      </p>
                      {contact.unreadCount ? (
                        <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {contact.unreadCount}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col h-full ${selectedContact ? 'flex' : 'hidden md:flex'}`}>
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Button 
                variant="ghost" 
                className="md:hidden mr-2" 
                onClick={() => setSelectedContact(null)}
              >
                <i className="i-arrow-left" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{selectedContact.name}</h2>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                      selectedContact.status === 'online' ? 'bg-green-500' : 
                      selectedContact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <span>{selectedContact.status}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                      <div className={`max-w-[80%] ${i % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                        <Skeleton className={`h-16 w-64 ${i % 2 === 0 ? 'rounded-l-lg rounded-tr-lg' : 'rounded-r-lg rounded-tl-lg'}`} />
                      </div>
                    </div>
                  ))}
                </>
              ) : messages.length > 0 ? (
                <>
                  {messages.map((message, index) => {
                    const isCurrentUserMessage = message.sender_id === currentUser;
                    const showDate = index === 0 || 
                      formatMessageDate(message.created_at) !== formatMessageDate(messages[index - 1].created_at);
                    
                    return (
                      <div key={message.id} className="space-y-1">
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <Badge variant="outline" className="bg-background text-muted-foreground px-3">
                              {formatMessageDate(message.created_at)}
                            </Badge>
                          </div>
                        )}
                        <div className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className="flex items-end gap-2 max-w-[85%]">
                            {!isCurrentUserMessage && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedContact.avatar} />
                                <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`px-4 py-2.5 rounded-2xl ${
                              isCurrentUserMessage ? 
                                'bg-primary text-primary-foreground rounded-tr-none' : 
                                'bg-secondary rounded-tl-none'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            </div>
                            {isCurrentUserMessage && (
                              <Avatar className="h-8 w-8 invisible">
                                <AvatarFallback>{currentUser?.[0]}</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                        <div className={`flex ${isCurrentUserMessage ? 'justify-end mr-10' : 'justify-start ml-10'}`}>
                          <span className="text-xs text-muted-foreground flex items-center">
                            {formatTime(message.created_at)}
                            {isCurrentUserMessage && message.is_read && (
                              <span className="ml-1 text-blue-500 text-xs">Read</span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="space-y-2">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-border">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }} 
                className="flex items-center space-x-2"
              >
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-4">
            <div className="space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-medium text-lg">Your Messages</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Select a conversation or start a new one to send messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
