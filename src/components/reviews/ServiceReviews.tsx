
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface ServiceReviewsProps {
  serviceId: string;
  canReview?: boolean;
}

export default function ServiceReviews({ serviceId, canReview = false }: ServiceReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [serviceId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          client:profiles!client_id(id, username, full_name, avatar_url)
        `)
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to submit a review.",
        });
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          service_id: serviceId,
          client_id: session.user.id,
          rating: newReview.rating,
          comment: newReview.comment.trim()
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Reviews ({reviews.length})</CardTitle>
            {reviews.length > 0 && (
              <div className="flex items-center space-x-2 mt-1">
                {renderStars(Math.round(averageRating))}
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} out of 5
                </span>
              </div>
            )}
          </div>
          
          {canReview && !showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="space-y-4 p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview({ ...newReview, rating })
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                placeholder="Share your experience with this service..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to review this service!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.client.avatar_url || ''} />
                    <AvatarFallback>
                      {(review.client.full_name?.[0] || review.client.username[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">
                        {review.client.full_name || review.client.username}
                      </span>
                      {renderStars(review.rating)}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
