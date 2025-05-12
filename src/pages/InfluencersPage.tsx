
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Globe } from 'lucide-react';

// Mock influencers data - in a real app, this would come from your database
const influencers = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
    specialty: 'Digital Marketing',
    bio: 'Digital marketing expert helping freelancers grow their online presence and find more clients.',
    followers: 45000,
    socialMedia: {
      instagram: 'priyasharma',
      twitter: 'priyasharma',
      linkedin: 'priyasharma',
      website: 'https://priyasharma.com'
    },
    featuredContent: [
      {
        title: '10 Ways to Market Your Freelance Business',
        type: 'blog',
        link: '/blog/1'
      },
      {
        title: 'Growing Your Freelance Business Through Social Media',
        type: 'workshop',
        link: '/events/2'
      }
    ]
  },
  {
    id: '2',
    name: 'Raj Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww',
    specialty: 'Web Development',
    bio: 'Full-stack developer sharing technical knowledge and career advice for programming freelancers.',
    followers: 32000,
    socialMedia: {
      instagram: 'rajmehta',
      twitter: 'rajmehta',
      linkedin: 'rajmehta',
      website: 'https://rajmehta.dev'
    },
    featuredContent: [
      {
        title: 'Building Your Technical Portfolio',
        type: 'guide',
        link: '/blog/3'
      },
      {
        title: 'Modern Web Development for Freelancers',
        type: 'course',
        link: '/events/4'
      }
    ]
  },
  {
    id: '3',
    name: 'Aarti Patel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
    specialty: 'Graphic Design',
    bio: 'Award-winning graphic designer mentoring creative freelancers on building sustainable businesses.',
    followers: 28000,
    socialMedia: {
      instagram: 'aartipatel',
      twitter: 'aartipatel',
      linkedin: 'aartipatel',
      website: 'https://aartipatel.design'
    },
    featuredContent: [
      {
        title: 'Design Principles for Non-Designers',
        type: 'workshop',
        link: '/events/5'
      },
      {
        title: 'Pricing Your Creative Services',
        type: 'guide',
        link: '/blog/6'
      }
    ]
  },
  {
    id: '4',
    name: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
    specialty: 'Business Growth',
    bio: 'Former corporate consultant turned freelancer who helps others scale their freelance business into agencies.',
    followers: 35000,
    socialMedia: {
      instagram: 'vikramsingh',
      twitter: 'vikramsingh',
      linkedin: 'vikramsingh',
      website: 'https://vikramsingh.com'
    },
    featuredContent: [
      {
        title: 'From Freelancer to Agency Owner',
        type: 'blog',
        link: '/blog/7'
      },
      {
        title: 'Financial Management for Freelancers',
        type: 'workshop',
        link: '/events/8'
      }
    ]
  },
  {
    id: '5',
    name: 'Neha Gupta',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBvcnRyYWl0fGVufDB8fDB8fHww',
    specialty: 'Content Creation',
    bio: 'Content strategist and writer helping freelancers craft compelling stories and marketing materials.',
    followers: 22000,
    socialMedia: {
      instagram: 'nehagupta',
      twitter: 'nehagupta',
      linkedin: 'nehagupta',
      website: 'https://nehagupta.com'
    },
    featuredContent: [
      {
        title: 'Content Strategy for Freelancers',
        type: 'guide',
        link: '/blog/9'
      },
      {
        title: 'Writing Copy That Converts',
        type: 'workshop',
        link: '/events/10'
      }
    ]
  },
];

export default function InfluencersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Influencers</h1>
            <p className="text-muted-foreground mt-2">
              Learn from the top experts in the Grew up community
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-10">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {influencers.map((influencer) => (
                  <Card key={influencer.id} className="overflow-hidden flex flex-col h-full">
                    <CardContent className="flex flex-col p-6">
                      <div className="flex flex-col items-center mb-4">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={influencer.avatar} alt={influencer.name} />
                          <AvatarFallback>{influencer.name[0]}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold">{influencer.name}</h3>
                        <p className="text-primary">{influencer.specialty}</p>
                      </div>
                      
                      <CardDescription className="text-center mb-4">
                        {influencer.bio}
                      </CardDescription>
                      
                      <div className="flex justify-center space-x-3 mb-4">
                        {influencer.socialMedia.instagram && (
                          <a href={`https://instagram.com/${influencer.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Instagram className="h-5 w-5" />
                          </a>
                        )}
                        {influencer.socialMedia.twitter && (
                          <a href={`https://twitter.com/${influencer.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter className="h-5 w-5" />
                          </a>
                        )}
                        {influencer.socialMedia.linkedin && (
                          <a href={`https://linkedin.com/in/${influencer.socialMedia.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {influencer.socialMedia.website && (
                          <a href={influencer.socialMedia.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Globe className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                      
                      <div className="text-center mb-4">
                        <span className="text-lg font-bold">{influencer.followers.toLocaleString()}</span>
                        <span className="text-muted-foreground"> followers</span>
                      </div>
                      
                      <div className="mt-auto">
                        <h4 className="font-medium mb-2">Featured Content:</h4>
                        <ul className="space-y-2">
                          {influencer.featuredContent.map((content, index) => (
                            <li key={index}>
                              <Link to={content.link} className="flex items-center text-sm hover:text-primary transition-colors">
                                <span className="px-2 py-0.5 bg-secondary rounded-full text-xs mr-2">
                                  {content.type}
                                </span>
                                {content.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button variant="outline" className="w-full mt-4">
                        Follow
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="marketing">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">Select a different category</h3>
                <p className="text-muted-foreground">
                  Switch to the "All" tab to see all influencers
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="design">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">Select a different category</h3>
                <p className="text-muted-foreground">
                  Switch to the "All" tab to see all influencers
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="development">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">Select a different category</h3>
                <p className="text-muted-foreground">
                  Switch to the "All" tab to see all influencers
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="business">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">Select a different category</h3>
                <p className="text-muted-foreground">
                  Switch to the "All" tab to see all influencers
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-secondary/50 p-6 md:p-8 rounded-lg mt-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Become an Influencer</h2>
                <p className="text-muted-foreground">
                  Share your expertise and grow your following on Grew up
                </p>
              </div>
              <Button size="lg">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
