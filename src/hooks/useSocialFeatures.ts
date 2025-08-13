import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SocialActivity {
  id: string;
  user_id: string;
  activity_type: 'watch' | 'rate' | 'review' | 'share' | 'follow';
  content_id?: string;
  content_title?: string;
  content_type?: string;
  rating?: number;
  review_text?: string;
  target_user_id?: string;
  created_at: string;
  user_profile: {
    full_name: string;
    avatar_url: string;
  };
}

interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  following_profile: {
    full_name: string;
    avatar_url: string;
  };
}

interface ContentReview {
  id: string;
  user_id: string;
  content_id: string;
  rating: number;
  review_text: string;
  helpful_count: number;
  created_at: string;
  user_profile: {
    full_name: string;
    avatar_url: string;
  };
}

export const useSocialFeatures = () => {
  const { user } = useAuth();
  const [socialFeed, setSocialFeed] = useState<SocialActivity[]>([]);
  const [following, setFollowing] = useState<UserFollow[]>([]);
  const [followers, setFollowers] = useState<UserFollow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSocialData();
    }
  }, [user]);

  const loadSocialData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await Promise.all([
        loadSocialFeed(),
        loadFollowing(),
        loadFollowers()
      ]);
    } catch (error) {
      console.error('Failed to load social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSocialFeed = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('social_activities')
        .select(`
          *,
          user_profile:profiles!social_activities_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .in('user_id', await getFollowingIds())
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setSocialFeed(data);
      }
    } catch (error) {
      console.error('Failed to load social feed:', error);
    }
  };

  const loadFollowing = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_follows')
        .select(`
          *,
          following_profile:profiles!user_follows_following_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('follower_id', user.id);

      if (data) {
        setFollowing(data);
      }
    } catch (error) {
      console.error('Failed to load following:', error);
    }
  };

  const loadFollowers = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_follows')
        .select(`
          *,
          follower_profile:profiles!user_follows_follower_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('following_id', user.id);

      if (data) {
        setFollowers(data);
      }
    } catch (error) {
      console.error('Failed to load followers:', error);
    }
  };

  const getFollowingIds = async (): Promise<string[]> => {
    if (!user) return [];

    const { data } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', user.id);

    return data?.map(f => f.following_id) || [];
  };

  const followUser = async (targetUserId: string) => {
    if (!user || targetUserId === user.id) return;

    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId
        });

      if (error) throw error;

      // Create social activity
      await createSocialActivity({
        activity_type: 'follow',
        target_user_id: targetUserId
      });

      loadFollowing();
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const unfollowUser = async (targetUserId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) throw error;

      loadFollowing();
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  const shareContent = async (contentId: string, contentTitle: string, contentType: string, message?: string) => {
    if (!user) return;

    try {
      await createSocialActivity({
        activity_type: 'share',
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        review_text: message
      });

      loadSocialFeed();
    } catch (error) {
      console.error('Failed to share content:', error);
    }
  };

  const createReview = async (
    contentId: string, 
    contentTitle: string, 
    contentType: string, 
    rating: number, 
    reviewText: string
  ) => {
    if (!user) return;

    try {
      // Create review
      const { error: reviewError } = await supabase
        .from('content_reviews')
        .insert({
          user_id: user.id,
          content_id: contentId,
          rating,
          review_text: reviewText
        });

      if (reviewError) throw reviewError;

      // Create social activity
      await createSocialActivity({
        activity_type: 'review',
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        rating,
        review_text: reviewText
      });

      loadSocialFeed();
    } catch (error) {
      console.error('Failed to create review:', error);
    }
  };

  const createSocialActivity = async (activity: Omit<SocialActivity, 'id' | 'user_id' | 'created_at' | 'user_profile'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_activities')
        .insert({
          user_id: user.id,
          ...activity
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to create social activity:', error);
    }
  };

  const getContentReviews = async (contentId: string): Promise<ContentReview[]> => {
    try {
      const { data } = await supabase
        .from('content_reviews')
        .select(`
          *,
          user_profile:profiles!content_reviews_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Failed to get content reviews:', error);
      return [];
    }
  };

  const markReviewHelpful = async (reviewId: string) => {
    if (!user) return;

    try {
      // Check if already marked helpful
      const { data: existing } = await supabase
        .from('review_helpful')
        .select('id')
        .eq('user_id', user.id)
        .eq('review_id', reviewId)
        .single();

      if (existing) return;

      // Mark as helpful
      await supabase
        .from('review_helpful')
        .insert({
          user_id: user.id,
          review_id: reviewId
        });

      // Update helpful count
      await supabase.rpc('increment_review_helpful_count', { review_id: reviewId });
    } catch (error) {
      console.error('Failed to mark review helpful:', error);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .ilike('full_name', `%${query}%`)
        .limit(10);

      return data || [];
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  };

  return {
    socialFeed,
    following,
    followers,
    loading,
    followUser,
    unfollowUser,
    shareContent,
    createReview,
    getContentReviews,
    markReviewHelpful,
    searchUsers,
    loadSocialData
  };
};