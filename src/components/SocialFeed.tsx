import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { useSocialFeatures } from '@/hooks/useSocialFeatures';
import { Heart, MessageCircle, Share2, Star, Users, Play, UserPlus, UserMinus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SocialFeed: React.FC = () => {
  // Mock data for now
  const socialFeed: any[] = [];
  const following: any[] = [];
  const followers: any[] = [];
  const loading = false;
  
  const followUser = async (userId: string) => {};
  const unfollowUser = async (userId: string) => {};
  const shareContent = async (id: string, title: string, type: string, message: string) => {};
  const createReview = async (id: string, title: string, type: string, rating: number, text: string) => {};
  
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [shareMessage, setShareMessage] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'watch': return <Play className="h-4 w-4" />;
      case 'rate': return <Star className="h-4 w-4" />;
      case 'review': return <MessageCircle className="h-4 w-4" />;
      case 'share': return <Share2 className="h-4 w-4" />;
      case 'follow': return <UserPlus className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.activity_type) {
      case 'watch':
        return `watched ${activity.content_title}`;
      case 'rate':
        return `rated ${activity.content_title} ${activity.rating}/10`;
      case 'review':
        return `reviewed ${activity.content_title}`;
      case 'share':
        return `shared ${activity.content_title}`;
      case 'follow':
        return `started following someone`;
      default:
        return 'had some activity';
    }
  };

  const handleShare = async () => {
    if (!selectedContent) return;

    await shareContent(
      selectedContent.id,
      selectedContent.title,
      selectedContent.type || 'movie',
      shareMessage
    );

    setShareDialogOpen(false);
    setShareMessage('');
    setSelectedContent(null);
  };

  const handleReview = async () => {
    if (!selectedContent) return;

    await createReview(
      selectedContent.id,
      selectedContent.title,
      selectedContent.type || 'movie',
      rating,
      reviewText
    );

    setReviewDialogOpen(false);
    setReviewText('');
    setRating(5);
    setSelectedContent(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="ml-4 space-y-1">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-3 bg-muted rounded w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Social Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">{following.length}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">{followers.length}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Activity Feed</h3>
        
        {socialFeed.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
              <p className="text-muted-foreground mb-4">
                Follow other users to see their activity in your feed
              </p>
              <Button>Discover Users</Button>
            </CardContent>
          </Card>
        ) : (
          socialFeed.map((activity) => (
            <Card key={activity.id}>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.user_profile?.avatar_url} />
                  <AvatarFallback>
                    {activity.user_profile?.full_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {activity.user_profile?.full_name || 'Anonymous User'}
                    </p>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {getActivityIcon(activity.activity_type)}
                      <span className="text-sm">{getActivityText(activity)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </CardHeader>
              
              {activity.review_text && (
                <CardContent>
                  <p className="text-sm">{activity.review_text}</p>
                  {activity.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < activity.rating! ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {activity.rating}/5
                      </span>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Add a message (optional)..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleShare}>Share</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 cursor-pointer ${
                      i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                    }`}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReview}>Post Review</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialFeed;