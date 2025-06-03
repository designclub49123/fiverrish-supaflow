
import { useState } from 'react';
import StandardPage from '@/components/layout/StandardPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const discussionThreads = [
    {
      id: 1,
      title: "Tips for creating an eye-catching gig thumbnail",
      author: "DesignPro",
      replies: 24,
      views: 342,
      lastActivity: "2 hours ago",
      category: "Seller Tips",
      tags: ["Design", "Marketing", "Thumbnails"]
    },
    {
      id: 2,
      title: "How to handle scope creep from clients",
      author: "FreelanceGuru",
      replies: 37,
      views: 512,
      lastActivity: "5 hours ago",
      category: "Client Management",
      tags: ["Clients", "Boundaries", "Pricing"]
    },
    {
      id: 3,
      title: "What is your favorite productivity tool?",
      author: "ProductivityQueen",
      replies: 45,
      views: 678,
      lastActivity: "1 day ago",
      category: "Tools & Resources",
      tags: ["Tools", "Productivity", "Software"]
    },
    {
      id: 4,
      title: "Finding your niche as a new freelancer",
      author: "NewbieCoder",
      replies: 19,
      views: 256,
      lastActivity: "2 days ago",
      category: "Getting Started",
      tags: ["Beginners", "Strategy", "Niche"]
    },
    {
      id: 5,
      title: "Share your freelancing success story!",
      author: "SuccessStory",
      replies: 52,
      views: 843,
      lastActivity: "3 days ago",
      category: "Success Stories",
      tags: ["Inspiration", "Growth", "Celebration"]
    }
  ];

  const announcementThreads = [
    {
      id: 101,
      title: "New Feature: Enhanced Portfolio Options",
      author: "Grew up Team",
      replies: 15,
      views: 1245,
      lastActivity: "1 day ago",
      category: "Platform Updates",
      tags: ["New Features", "Portfolio"]
    },
    {
      id: 102,
      title: "Upcoming Maintenance: July 15th",
      author: "Grew up Team",
      replies: 8,
      views: 986,
      lastActivity: "2 days ago",
      category: "Announcements",
      tags: ["Maintenance", "Downtime"]
    }
  ];

  const filteredDiscussions = searchQuery
    ? discussionThreads.filter(thread => 
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : discussionThreads;

  const filteredAnnouncements = searchQuery
    ? announcementThreads.filter(thread => 
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : announcementThreads;

  const ThreadCard = ({ thread }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{thread.title}</CardTitle>
            <CardDescription>Posted by {thread.author} • {thread.lastActivity}</CardDescription>
          </div>
          <Badge variant="outline">{thread.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {thread.replies} replies
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {thread.views} views
            </div>
          </div>
          <div className="flex gap-2">
            {thread.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <StandardPage 
      title="Community Forum" 
      subtitle="Connect with other freelancers and clients to share knowledge and experiences"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search discussions..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>Start New Discussion</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-4 flex items-center">
          <MessageSquare className="h-8 w-8 text-primary mr-3" />
          <div>
            <p className="text-2xl font-bold">1,245</p>
            <p className="text-sm text-muted-foreground">Discussions</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center">
          <Users className="h-8 w-8 text-primary mr-3" />
          <div>
            <p className="text-2xl font-bold">8,752</p>
            <p className="text-sm text-muted-foreground">Community Members</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center">
          <TrendingUp className="h-8 w-8 text-primary mr-3" />
          <div>
            <p className="text-2xl font-bold">32,148</p>
            <p className="text-sm text-muted-foreground">Posts This Month</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center">
          <Clock className="h-8 w-8 text-primary mr-3" />
          <div>
            <p className="text-2xl font-bold">15 mins</p>
            <p className="text-sm text-muted-foreground">Avg. Response Time</p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="discussions">
        <TabsList className="mb-6">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions">
          <div className="space-y-2">
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">No discussions found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or start a new discussion.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="announcements">
          <div className="space-y-2">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">No announcements found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or check back later.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="unanswered">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">Help the community</h3>
            <p className="text-muted-foreground mb-6">
              These discussions need your expertise. Share your knowledge with others!
            </p>
            <Button>View Unanswered Discussions</Button>
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">Trending Discussions</h3>
            <p className="text-muted-foreground mb-6">
              See what topics are popular in the community right now.
            </p>
            <Button>View Popular Discussions</Button>
          </div>
        </TabsContent>
      </Tabs>
    </StandardPage>
  );
}
