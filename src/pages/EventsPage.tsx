
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarDays, Clock, MapPin, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock events data - in a real app, this would come from your database
const events = [
  {
    id: '1',
    title: 'Freelancer Networking Mixer',
    description: 'Connect with other freelancers and potential clients in a relaxed setting.',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG5ldHdvcmtpbmd8ZW58MHx8MHx8fDA%3D',
    date: '2023-12-15',
    time: '18:30 - 21:00',
    location: 'Tech Hub, Mumbai',
    category: 'Networking',
    isVirtual: false,
    attendeeCount: 45,
    maxAttendees: 50
  },
  {
    id: '2',
    title: 'Mastering Digital Marketing Workshop',
    description: 'Learn effective strategies to market your freelance services online.',
    image: 'https://images.unsplash.com/photo-1551192866-2d38ae323a82?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D',
    date: '2023-12-20',
    time: '10:00 - 13:00',
    location: 'Online',
    category: 'Workshop',
    isVirtual: true,
    attendeeCount: 120,
    maxAttendees: 200
  },
  {
    id: '3',
    title: 'Freelancer Success Stories: Panel Discussion',
    description: 'Hear from successful freelancers about their journey and get inspired.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGRpc2N1c3Npb258ZW58MHx8MHx8fDA%3D',
    date: '2023-12-22',
    time: '16:00 - 18:00',
    location: 'Creative Space, Delhi',
    category: 'Panel',
    isVirtual: false,
    attendeeCount: 35,
    maxAttendees: 60
  },
  {
    id: '4',
    title: 'Web Development Bootcamp for Freelancers',
    description: 'Intensive training on the latest web development technologies for freelancers.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D',
    date: '2024-01-10',
    time: '09:00 - 17:00',
    location: 'Online',
    category: 'Workshop',
    isVirtual: true,
    attendeeCount: 90,
    maxAttendees: 100
  },
  {
    id: '5',
    title: 'Freelancers Year-End Celebration',
    description: 'Join us for a fun evening celebrating the achievements of our community members.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2VsZWJyYXRpb258ZW58MHx8MHx8fDA%3D',
    date: '2023-12-30',
    time: '19:00 - 23:00',
    location: 'Grand Hotel, Bangalore',
    category: 'Networking',
    isVirtual: false,
    attendeeCount: 80,
    maxAttendees: 100
  }
];

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-2">
              Join Grew up events to learn, connect, and grow your network
            </p>
          </div>

          <Tabs defaultValue="upcoming" className="mb-10">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="my-events">My Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden flex flex-col h-full">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={event.isVirtual ? "secondary" : "default"}>
                          {event.isVirtual ? 'Virtual' : 'In Person'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="flex-grow flex flex-col p-6">
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {event.category}
                        </span>
                      </div>
                      <CardTitle className="mb-2">
                        <Link to={`/events/${event.id}`} className="hover:text-primary transition-colors">
                          {event.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="flex-grow mb-4">
                        {event.description}
                      </CardDescription>
                      
                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center text-sm">
                          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{format(new Date(event.date), 'MMMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{event.attendeeCount}/{event.maxAttendees} attendees</span>
                          </div>
                          <Button size="sm">
                            {event.attendeeCount >= event.maxAttendees ? 'Join Waitlist' : 'RSVP'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="past">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">No past events</h3>
                <p className="text-muted-foreground">
                  Check back later for recordings and materials from previous events
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="my-events">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">You haven't registered for any events yet</h3>
                <p className="text-muted-foreground mb-4">
                  Browse our upcoming events and RSVP to join
                </p>
                <Button>Explore Events</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-secondary/50 p-6 md:p-8 rounded-lg mt-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Want to host your own event?</h2>
                <p className="text-muted-foreground">
                  Share your knowledge with the Grew up community
                </p>
              </div>
              <Button size="lg">
                Submit Event Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
