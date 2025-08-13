import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Movie } from '@/types/movie';

interface UserPreferences {
  favorite_genres: string[];
  preferred_content_types: string[];
  viewing_time_preference: string;
  language_preference: string;
}

interface ViewingHistory {
  content_id: string;
  content_type: string;
  watch_time_ms: number;
  completed: boolean;
  rating?: number;
  genres: string[];
}

export const useRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [viewingHistory, setViewingHistory] = useState<ViewingHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load user preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (preferences) {
        setUserPreferences(preferences);
      }

      // Load viewing history from playback sessions
      const { data: sessions } = await supabase
        .from('playback_sessions')
        .select(`
          content_id,
          content_type,
          playback_qoe (
            watch_time_ms,
            exited_early
          )
        `)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(50);

      if (sessions) {
        const history = sessions.map(session => ({
          content_id: session.content_id,
          content_type: session.content_type,
          watch_time_ms: session.playback_qoe?.[0]?.watch_time_ms || 0,
          completed: !session.playback_qoe?.[0]?.exited_early,
          genres: [] // Would be populated from content metadata
        }));
        setViewingHistory(history);
      }

      generateRecommendations();
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Collaborative filtering approach
      const recommendations = await getCollaborativeRecommendations();
      
      // Content-based filtering
      const contentBased = await getContentBasedRecommendations();
      
      // Trending content
      const trending = await getTrendingContent();
      
      // Combine and rank recommendations
      const combined = combineRecommendations([
        ...recommendations,
        ...contentBased,
        ...trending
      ]);
      
      setRecommendations(combined);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCollaborativeRecommendations = async (): Promise<Movie[]> => {
    // Find users with similar viewing patterns
    const { data: similarUsers } = await supabase
      .rpc('find_similar_users', { target_user_id: user?.id });

    if (!similarUsers?.length) return [];

    // Get content watched by similar users that current user hasn't seen
    const { data: recommendations } = await supabase
      .rpc('get_collaborative_recommendations', { 
        target_user_id: user?.id,
        similar_user_ids: similarUsers.map((u: any) => u.user_id)
      });

    return recommendations || [];
  };

  const getContentBasedRecommendations = async (): Promise<Movie[]> => {
    if (!userPreferences?.favorite_genres?.length) return [];

    // Fetch content from external APIs based on user preferences
    const recommendations: Movie[] = [];
    
    for (const genre of userPreferences.favorite_genres) {
      try {
        const response = await supabase.functions.invoke('fetch-movies', {
          body: { 
            type: 'movies', 
            category: 'discover',
            with_genres: genre,
            sort_by: 'popularity.desc'
          }
        });
        
        if (response.data?.results) {
          recommendations.push(...response.data.results.slice(0, 5));
        }
      } catch (error) {
        console.error(`Failed to fetch ${genre} recommendations:`, error);
      }
    }

    return recommendations;
  };

  const getTrendingContent = async (): Promise<Movie[]> => {
    try {
      const [moviesResponse, tvResponse] = await Promise.all([
        supabase.functions.invoke('fetch-movies', {
          body: { type: 'movies', category: 'trending' }
        }),
        supabase.functions.invoke('fetch-movies', {
          body: { type: 'tv', category: 'trending' }
        })
      ]);

      const trending = [
        ...(moviesResponse.data?.results || []).slice(0, 10),
        ...(tvResponse.data?.results || []).slice(0, 10)
      ];

      return trending;
    } catch (error) {
      console.error('Failed to fetch trending content:', error);
      return [];
    }
  };

  const combineRecommendations = (recommendations: Movie[]): Movie[] => {
    // Remove duplicates and rank by relevance score
    const uniqueRecommendations = recommendations.reduce((acc, movie) => {
      if (!acc.find(m => m.id === movie.id)) {
        acc.push({
          ...movie,
          relevanceScore: calculateRelevanceScore(movie)
        });
      }
      return acc;
    }, [] as (Movie & { relevanceScore: number })[]);

    return uniqueRecommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20);
  };

  const calculateRelevanceScore = (movie: Movie): number => {
    let score = 0;

    // Base score from rating
    score += movie.rating * 10;

    // Boost for preferred genres
    if (userPreferences?.favorite_genres?.includes(movie.genre)) {
      score += 50;
    }

    // Boost for preferred content types
    if (userPreferences?.preferred_content_types?.includes(movie.type || 'movie')) {
      score += 30;
    }

    // Boost for recent content
    const currentYear = new Date().getFullYear();
    const movieYear = parseInt(movie.year);
    if (movieYear >= currentYear - 2) {
      score += 20;
    }

    return score;
  };

  const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setUserPreferences(prev => ({ ...prev, ...preferences } as UserPreferences));
      generateRecommendations();
    } catch (error) {
      console.error('Failed to update user preferences:', error);
    }
  };

  const rateContent = async (contentId: string, rating: number) => {
    if (!user) return;

    try {
      await supabase
        .from('content_ratings')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          rating,
          created_at: new Date().toISOString()
        });

      // Regenerate recommendations after rating
      generateRecommendations();
    } catch (error) {
      console.error('Failed to rate content:', error);
    }
  };

  return {
    recommendations,
    userPreferences,
    viewingHistory,
    loading,
    updateUserPreferences,
    rateContent,
    generateRecommendations
  };
};