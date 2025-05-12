
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { CalendarDays, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock blog data - in a real app, this would come from your database
const blogPosts = [
  {
    id: '1',
    title: 'How to Start Your Freelancing Career',
    excerpt: 'Tips and tricks for beginners on how to start a successful freelancing career in 2023.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhbSUyMHdvcmt8ZW58MHx8MHx8fDA%3D',
    category: 'Freelancing',
    author: 'Sarah Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
    date: '2023-11-15',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: '10 Ways to Improve Your Service Descriptions',
    excerpt: 'Learn how to write compelling service descriptions that attract more clients and boost your sales.',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d3JpdGluZ3xlbnwwfHwwfHx8MA%3D%3D',
    category: 'Marketing',
    author: 'Michael Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
    date: '2023-10-28',
    readTime: '8 min read'
  },
  {
    id: '3',
    title: 'Managing Client Expectations for Success',
    excerpt: 'Strategies for maintaining clear communication and setting realistic expectations with clients.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVldGluZ3xlbnwwfHwwfHx8MA%3D%3D',
    category: 'Client Relations',
    author: 'Priya Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
    date: '2023-10-15',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'The Future of Remote Work and Freelancing',
    excerpt: 'How emerging technologies and changing work culture are shaping the future of freelancing.',
    image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmVtb3RlJTIwd29ya3xlbnwwfHwwfHx8MA%3D%3D',
    category: 'Industry Trends',
    author: 'James Wilson',
    authorAvatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww',
    date: '2023-09-22',
    readTime: '10 min read'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
            <p className="text-muted-foreground mt-2">
              Insights, tips, and trends from the Grew up community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="flex-grow flex flex-col p-6">
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="mb-2">
                    <Link to={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex-grow mb-4">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <div className="flex items-center">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.author} 
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                      <span className="text-sm font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline">
              Load More Articles
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
