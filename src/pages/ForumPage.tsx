
import { useState } from 'react';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Search, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Mock forum data - in a real app, this would come from your database
const forumThreads = [
  {
    id: '1',
    title: 'How do I get my first client as a beginner?',
    category: 'Getting Started',
    author: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww',
      level: 'Newbie'
    },
    date: '2023-11-18T14:22:00Z',
    replies: 12,
    views: 234,
    pinned: true
  },
  {
    id: '2',
    title: 'Tips for creating an outstanding portfolio that gets you noticed',
    category: 'Portfolio Building',
    author: {
      name: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBvcnRyYWl0fGVufDB8fDB8fHww',
      level: 'Established'
    },
    date: '2023-11-17T09:14:00Z',
    replies: 23,
    views: 512,
    pinned: false
  },
  {
    id: '3',
    title: 'Dealing with difficult clients - advice needed',
    category: 'Client Relations',
    author: {
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww',
      level: 'Pro'
    },
    date: '2023-11-16T16:45:00Z',
    replies: 34,
    views: 678,
    pinned: false
  },
  {
    id: '4',
    title: 'What's your pricing strategy for design services?',
    category: 'Business',
    author: {
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
      level: 'Veteran'
    },
    date: '2023-11-15T08:30:00Z',
    replies: 45,
    views: 823,
    pinned: false
  },
  {
    id: '5',
    title: 'Recent updates to platform - discussion thread',
    category: 'Platform Updates',
    author: {
      name: 'Admin',
      avatar: '',
      level: 'Staff'
    },
    date: '2023-11-14T10:22:00Z',
    replies: 16,
    views: 1203,
    pinned: true
  }
];

const categories = [
  'All Categories',
  'Getting Started',
  'Portfolio Building',
  'Client Relations',
  'Business',
  'Platform Updates',
  'Technical',
  'Showcase'
];

export default function ForumPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Community Forum</h1>
            <p className="text-muted-foreground mt-2">
              Connect, learn, and grow with other Grew up users
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="w-full md:w-3/4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full md:w-auto">
              Start New Topic
            </Button>
          </div>

          <Tabs defaultValue="latest" className="mb-6">
            <TabsList>
              <TabsTrigger value="latest" onClick={() => setFilter('all')}>
                Latest
              </TabsTrigger>
              <TabsTrigger value="popular" onClick={() => setFilter('popular')}>
                Popular
              </TabsTrigger>
              <TabsTrigger value="unanswered" onClick={() => setFilter('unanswered')}>
                Unanswered
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-4">
            {forumThreads.map((thread) => (
              <Card key={thread.id} className={`hover:bg-secondary/50 transition-colors ${thread.pinned ? 'border-primary/30' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-[50px] flex flex-row md:flex-col items-center justify-start md:justify-center space-x-3 md:space-x-0 md:space-y-1">
                      <Button variant="ghost" size="sm" className="px-1 md:px-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <div className="text-center">
                        <div className="text-lg font-bold">{thread.replies}</div>
                        <div className="text-xs text-muted-foreground">replies</div>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <Link 
                            to={`/forum/${thread.id}`} 
                            className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2 mb-1"
                          >
                            {thread.title}
                          </Link>
                          <div className="flex items-center flex-wrap gap-2 text-sm">
                            <Badge variant="secondary">{thread.category}</Badge>
                            <span className="text-muted-foreground text-xs">
                              {formatDistanceToNow(new Date(thread.date), { addSuffix: true })}
                            </span>
                            {thread.pinned && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                Pinned
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{thread.views} views</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center mt-2 md:mt-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={thread.author.avatar} />
                        <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <div className="text-sm font-medium">{thread.author.name}</div>
                        <div className="text-xs text-muted-foreground">{thread.author.level}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="outline">
              Load More Topics
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
