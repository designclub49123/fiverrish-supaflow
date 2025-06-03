
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [showConversations, setShowConversations] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (location.state?.contactId && currentUserId) {
      handleDirectContact(location.state.contactId);
    }
  }, [location.state, currentUserId]);

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

  const handleDirectContact = async (contactId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', contactId)
        .single();

      if (error) throw error;

      if (profile) {
        setSelectedUser(contactId);
        setSelectedUserDetails({
          username: profile.username,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
        });
        await fetchMessages(contactId);
        if (isMobile) {
          setShowConversations(false);
        }
      }
    } catch (error) {
      console.error('Error fetching contact profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load contact profile.",
      });
    }
  };

  const fetchConversations = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);

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

      console.log('Fetched messages:', messagesData); // Debugging log

      const conversationsMap = new Map<string, Conversation>();

      messagesData.forEach((message: any) => {
        const isUserSender = message.sender_id === currentUserId;
        const otherUserId = isUserSender ? message.receiver_id : message.sender_id;
        const otherUserData = isUserSender ? message.receiver : message.sender;

        if (!otherUserId || !otherUserData) return;

        const existingConversation = conversationsMap.get(otherUserId);
        const isUnread = !message.is_read && message.receiver_id === currentUserId;

        if (existingConversation) {
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
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            username: otherUserData.username,
            fullName: otherUserData.full_name,
            avatarUrl: otherUserData.avatar_url,
            lastMessage: message.content,
            lastMessageDate: message.created_at,
            unreadCount: isUnread ? 1 : 0,
          });
        }
      });

      const sortedConversations = Array.from(conversationsMap.values()).sort(
        (a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
      );

      console.log('Sorted conversations:', sortedConversations); // Debugging log

      setConversations(sortedConversations);

      if (!selectedUser && sortedConversations.length > 0 && !isMobile) {
        setSelectedUser(sortedConversations[0].userId);
        setSelectedUserDetails({
          username: sortedConversations[0].username,
          fullName: sortedConversations[0].fullName,
          avatarUrl: sortedConversations[0].avatarUrl,
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

  const fetchMessages = async (userId: string | null) => {
    if (!currentUserId || !userId) return;

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

      console.log('Fetched messages for user:', userId, data); // Debugging log

      setMessages(data || []);

      const unreadMessages = data
        ?.filter((msg) => msg.receiver_id === currentUserId && !msg.is_read)
        .map((msg) => msg.id);

      if (unreadMessages && unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessages);

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
          is_read: false,
        });

      if (error) throw error;

      setNewMessage('');
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
      avatarUrl,
    });
    fetchMessages(userId);
    if (isMobile) {
      setShowConversations(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'h:mm a');
    } else {
      return format(messageDate, 'MMM d, h:mm a');
    }
  };

  const goBackToConversations = () => {
    setShowConversations(true);
    setSelectedUser(null);
    setSelectedUserDetails(null);
    setMessages([]);
  };

  // Mobile layout
  if (isMobile) {
    if (showConversations) {
      return (
        <div className="h-screen flex flex-col bg-gray-100">
          <div className="bg-white border-b px-4 py-3 sticky top-0 z-10 shadow-sm">
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse p-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length > 0 ? (
              <div className="divide-y">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    className="flex items-center space-x-3 p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-200"
                    onClick={() =>
                      selectConversation(
                        conversation.userId,
                        conversation.username,
                        conversation.fullName,
                        conversation.avatarUrl
                      )
                    }
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.avatarUrl || ''} />
                      <AvatarFallback>
                        {(conversation.fullName?.charAt(0) || conversation.username.charAt(0) || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.fullName || conversation.username}
                        </h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {format(new Date(conversation.lastMessageDate), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-blue-500 text-white h-5 min-w-5 rounded-full flex items-center justify-center text-xs font-medium">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-4 text-center">
                <div>
                  <h3 className="font-medium">No conversations yet</h3>
                  <p className="text-gray-500 text-sm mt-1">Messages will appear here when you start chatting</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      );
    }

    // Chat view for mobile
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        {selectedUserDetails && (
          <>
            {/* Sticky Header */}
            <div className="bg-white border-b px-4 py-3 flex items-center space-x-3 sticky top-0 z-10 shadow-sm">
              <Button variant="ghost" size="icon" onClick={goBackToConversations} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedUserDetails.avatarUrl || ''} />
                <AvatarFallback>
                  {(selectedUserDetails.fullName?.charAt(0) || selectedUserDetails.username.charAt(0) || 'U').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{selectedUserDetails.fullName || selectedUserDetails.username}</h3>
                <p className="text-xs text-gray-500">@{selectedUserDetails.username}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="h-4 w-4" />
              </Button>
            </div>

            {/* Scrollable Messages */}
            <ScrollArea className="flex-1 p-4 bg-white">
              <div className="space-y-4 min-h-full">
                {messages.length > 0 ? (
                  messages.map((message) => {
                    const isCurrentUser = message.sender_id === currentUserId;
                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isCurrentUser ? 'bg-blue-500 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <span
                            className={`text-xs text-gray-500 mt-1 block ${isCurrentUser ? 'text-right' : 'text-left'}`}
                          >
                            {formatMessageDate(message.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex items-end space-x-2">
              <Input
                placeholder="Message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 rounded-full border-gray-300"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()} className="rounded-full h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-screen flex flex-col bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
      </div>
      <Card className="flex-1 overflow-hidden shadow-sm">
        <div className="grid grid-cols-[300px_1fr] h-full">
          {/* Conversations list */}
          <div className="border-r bg-white">
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-gray-700">Conversations</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-180px)]">
              {loading ? (
                <div className="space-y-4 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 animate-pulse p-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length > 0 ? (
                <div>
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      className={`flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200 relative ${
                        selectedUser === conversation.userId ? 'bg-gray-100 border-r-2 border-blue-500' : ''
                      }`}
                      onClick={() =>
                        selectConversation(
                          conversation.userId,
                          conversation.username,
                          conversation.fullName,
                          conversation.avatarUrl
                        )
                      }
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatarUrl || ''} />
                        <AvatarFallback>
                          {(conversation.fullName?.charAt(0) || conversation.username.charAt(0) || 'U').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-medium text-sm truncate">
                            {conversation.fullName || conversation.username}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {format(new Date(conversation.lastMessageDate), 'MMM d')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-blue-500 text-white h-5 min-w-5 rounded-full flex items-center justify-center text-xs font-medium">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4 text-center">
                  <div>
                    <h3 className="font-medium text-gray-700">No conversations yet</h3>
                    <p className="text-gray-500 text-sm mt-1">Messages will appear here when you start chatting</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Messages area */}
          <div className="flex flex-col bg-white">
            {selectedUser && selectedUserDetails ? (
              <>
                {/* Sticky Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedUserDetails.avatarUrl || ''} />
                      <AvatarFallback>
                        {(selectedUserDetails.fullName?.charAt(0) || selectedUserDetails.username.charAt(0) || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedUserDetails.fullName || selectedUserDetails.username}</h3>
                      <p className="text-xs text-gray-500">@{selectedUserDetails.username}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </div>

                {/* Scrollable Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4 min-h-full">
                    {messages.length > 0 ? (
                      messages.map((message) => {
                        const isCurrentUser = message.sender_id === currentUserId;
                        return (
                          <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`px-4 py-2 rounded-lg ${
                                  isCurrentUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <span
                                className={`text-xs text-gray-500 mt-1 block ${isCurrentUser ? 'text-right' : 'text-left'}`}
                              >
                                {formatMessageDate(message.created_at)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()} className="rounded-lg bg-blue-500 hover:bg-blue-600">
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="font-medium text-gray-700 text-lg">Select a conversation</h3>
                  <p className="text-gray-500 max-w-xs mt-2">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
