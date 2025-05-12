
import { useState } from 'react';
import StandardPage from '@/components/layout/StandardPage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';

export default function EventsPage() {
  const [eventCategory, setEventCategory] = useState('all');
  
  const upcomingEvents = [
    {
      id: 1,
      title: "Freelancer Growth Summit",
      description: "A virtual conference featuring success stories and growth strategies from top freelancers.",
      date: "July 15-16, 2025",
      time: "9:00 AM - 5:00 PM EST",
      location: "Virtual",
      category: "conference",
      attendees: 1250,
      image: "https://via.placeholder.com/300x150"
    },
    {
      id: 2,
      title: "Portfolio Masterclass",
      description: "Learn how to showcase your work effectively to attract high-quality clients.",
      date: "July 22, 2025",
      time: "2:00 PM - 4:00 PM EST",
      location: "Virtual",
      category: "workshop",
      attendees: 350,
      image: "https://via.placeholder.com/300x150"
    },
    {
      id: 3,
      title: "New York Freelancers Meetup",
      description: "Network with fellow freelancers in the New York area and share experiences.",
      date: "August 5, 2025",
      time: "6:30 PM - 9:00 PM EST",
      location: "New York, NY",
      category: "meetup",
      attendees: 75,
      image: "https://via.placeholder.com/300x150"
    }
  ];
  
  const pastEvents = [
    {
      id: 101,
      title: "Pricing Strategies for Freelancers",
      description: "A workshop on how to price your services for maximum profitability and client satisfaction.",
      date: "June 10, 2025",
      time: "1:00 PM - 3:00 PM EST",
      location: "Virtual",
      category: "workshop",
      attendees: 420,
      image: "https://via.placeholder.com/300x150",
      recording: true
    },
    {
      id: 102,
      title: "Digital Marketing for Freelancers",
      description: "Learn effective strategies to market your services and attract more clients.",
      date: "May 28, 2025",
      time: "11:00 AM - 1:00 PM EST",
      location: "Virtual",
      category: "webinar",
      attendees: 560,
      image: "https://via.placeholder.com/300x150",
      recording: true
    }
  ];
  
  const filteredUpcoming = eventCategory === 'all' 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.category === eventCategory);
    
  const filteredPast = eventCategory === 'all' 
    ? pastEvents 
    : pastEvents.filter(event => event.category === eventCategory);

  return (
    <StandardPage 
      title="Events" 
      subtitle="Join our community events to learn, connect, and grow your freelance business"
    >
      <div className="mb-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEventCategory('all')} className={eventCategory === 'all' ? 'bg-primary/10' : ''}>
                All
              </Button>
              <Button variant="outline" onClick={() => setEventCategory('conference')} className={eventCategory === 'conference' ? 'bg-primary/10' : ''}>
                Conferences
              </Button>
              <Button variant="outline" onClick={() => setEventCategory('workshop')} className={eventCategory === 'workshop' ? 'bg-primary/10' : ''}>
                Workshops
              </Button>
              <Button variant="outline" onClick={() => setEventCategory('meetup')} className={eventCategory === 'meetup' ? 'bg-primary/10' : ''}>
                Meetups
              </Button>
            </div>
          </div>
          
          <TabsContent value="upcoming">
            {filteredUpcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcoming.map((event) => (
                  <Card key={event.id}>
                    <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge>{event.category}</Badge>
                      </div>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.date}, {event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Register Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">
                  There are no upcoming events in this category. Check back later or view all events.
                </p>
                <Button variant="outline" onClick={() => setEventCategory('all')}>View All Events</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {filteredPast.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPast.map((event) => (
                  <Card key={event.id}>
                    <img src={event.image} alt={event.title} className="w-full h-40 object-cover opacity-80" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.date}, {event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.attendees} attended</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {event.recording ? (
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Watch Recording
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>Event Ended</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No past events found</h3>
                <p className="text-muted-foreground mb-6">
                  There are no past events in this category. Try viewing all events instead.
                </p>
                <Button variant="outline" onClick={() => setEventCategory('all')}>View All Events</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StandardPage>
  );
}
