/*
  # Complete Streaming Platform Schema

  This migration creates all the necessary tables for a comprehensive streaming platform
  that rivals Netflix/Hulu/Prime with advanced features across all phases.

  ## New Tables
  1. **user_preferences** - User viewing preferences and settings
  2. **social_activities** - User social activities and interactions
  3. **user_follows** - User following relationships
  4. **content_reviews** - User reviews and ratings for content
  5. **review_helpful** - Helpful votes for reviews
  6. **content_ratings** - Simple content ratings
  7. **watch_parties** - Group watching sessions
  8. **watch_party_participants** - Participants in watch parties
  9. **user_achievements** - Gamification achievements
  10. **content_metadata** - Extended content information
  11. **viewing_sessions** - Detailed viewing session tracking
  12. **ab_experiments** - A/B testing framework
  13. **user_experiment_assignments** - User experiment assignments

  ## Security
  - All tables have RLS enabled
  - Appropriate policies for user data access
  - Privacy controls for social features
*/

-- User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_genres TEXT[] DEFAULT '{}',
  preferred_content_types TEXT[] DEFAULT '{}',
  viewing_time_preference TEXT DEFAULT 'evening',
  language_preference TEXT DEFAULT 'en',
  autoplay_enabled BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  mature_content_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Social Activities Table
CREATE TABLE IF NOT EXISTS public.social_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('watch', 'rate', 'review', 'share', 'follow')),
  content_id TEXT,
  content_title TEXT,
  content_type TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  review_text TEXT,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Follows Table
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Content Reviews Table
CREATE TABLE IF NOT EXISTS public.content_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Review Helpful Table
CREATE TABLE IF NOT EXISTS public.review_helpful (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES public.content_reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, review_id)
);

-- Content Ratings Table (Simple ratings without reviews)
CREATE TABLE IF NOT EXISTS public.content_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Watch Parties Table
CREATE TABLE IF NOT EXISTS public.watch_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  party_name TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ,
  max_participants INTEGER DEFAULT 10,
  is_private BOOLEAN DEFAULT false,
  invite_code TEXT UNIQUE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Watch Party Participants Table
CREATE TABLE IF NOT EXISTS public.watch_party_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID NOT NULL REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(party_id, user_id)
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  points INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_type, achievement_name)
);

-- Content Metadata Table (Extended content information)
CREATE TABLE IF NOT EXISTS public.content_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  genres TEXT[] DEFAULT '{}',
  cast_members TEXT[] DEFAULT '{}',
  directors TEXT[] DEFAULT '{}',
  release_date DATE,
  runtime_minutes INTEGER,
  imdb_rating DECIMAL(3,1),
  tmdb_rating DECIMAL(3,1),
  age_rating TEXT,
  languages TEXT[] DEFAULT '{}',
  countries TEXT[] DEFAULT '{}',
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Viewing Sessions Table (Enhanced session tracking)
CREATE TABLE IF NOT EXISTS public.viewing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  session_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_end TIMESTAMPTZ,
  watch_duration_seconds INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  quality_level TEXT,
  device_type TEXT,
  platform TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A/B Experiments Table
CREATE TABLE IF NOT EXISTS public.ab_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_name TEXT NOT NULL UNIQUE,
  description TEXT,
  variants JSONB NOT NULL,
  traffic_allocation DECIMAL(3,2) DEFAULT 1.0,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Experiment Assignments Table
CREATE TABLE IF NOT EXISTS public.user_experiment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, experiment_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpful ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_party_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_experiment_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Preferences Policies
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Social Activities Policies
CREATE POLICY "Users can view activities from followed users" ON public.social_activities
  FOR SELECT USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT following_id FROM public.user_follows WHERE follower_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own activities" ON public.social_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON public.social_activities
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" ON public.social_activities
  FOR DELETE USING (auth.uid() = user_id);

-- User Follows Policies
CREATE POLICY "Users can view their own follows" ON public.user_follows
  FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can manage their own follows" ON public.user_follows
  FOR ALL USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);

-- Content Reviews Policies
CREATE POLICY "Anyone can view reviews" ON public.content_reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reviews" ON public.content_reviews
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Review Helpful Policies
CREATE POLICY "Users can view helpful votes" ON public.review_helpful FOR SELECT USING (true);
CREATE POLICY "Users can manage their own helpful votes" ON public.review_helpful
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Content Ratings Policies
CREATE POLICY "Users can manage their own ratings" ON public.content_ratings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Watch Parties Policies
CREATE POLICY "Users can view public parties and their own parties" ON public.watch_parties
  FOR SELECT USING (is_private = false OR host_id = auth.uid() OR id IN (
    SELECT party_id FROM public.watch_party_participants WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own parties" ON public.watch_parties
  FOR ALL USING (auth.uid() = host_id) WITH CHECK (auth.uid() = host_id);

-- Watch Party Participants Policies
CREATE POLICY "Users can view participants of accessible parties" ON public.watch_party_participants
  FOR SELECT USING (
    party_id IN (
      SELECT id FROM public.watch_parties 
      WHERE is_private = false OR host_id = auth.uid() OR id IN (
        SELECT party_id FROM public.watch_party_participants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage their own participation" ON public.watch_party_participants
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User Achievements Policies
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (true);

-- Content Metadata Policies
CREATE POLICY "Anyone can view content metadata" ON public.content_metadata FOR SELECT USING (true);

-- Viewing Sessions Policies
CREATE POLICY "Users can view their own sessions" ON public.viewing_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" ON public.viewing_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- A/B Experiments Policies
CREATE POLICY "Anyone can view active experiments" ON public.ab_experiments
  FOR SELECT USING (is_active = true);

-- User Experiment Assignments Policies
CREATE POLICY "Users can view their own assignments" ON public.user_experiment_assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create assignments" ON public.user_experiment_assignments
  FOR INSERT WITH CHECK (true);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_social_activities_user_id ON public.social_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_social_activities_created_at ON public.social_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON public.user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_content_reviews_content_id ON public.content_reviews(content_id);
CREATE INDEX IF NOT EXISTS idx_content_reviews_rating ON public.content_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_watch_parties_status ON public.watch_parties(status);
CREATE INDEX IF NOT EXISTS idx_watch_parties_scheduled_time ON public.watch_parties(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_viewing_sessions_user_id ON public.viewing_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_viewing_sessions_content_id ON public.viewing_sessions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_metadata_content_type ON public.content_metadata(content_type);
CREATE INDEX IF NOT EXISTS idx_content_metadata_genres ON public.content_metadata USING GIN(genres);

-- Functions for Advanced Features

-- Function to increment review helpful count
CREATE OR REPLACE FUNCTION public.increment_review_helpful_count(review_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.content_reviews 
  SET helpful_count = helpful_count + 1 
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to find similar users (simplified collaborative filtering)
CREATE OR REPLACE FUNCTION public.find_similar_users(target_user_id UUID)
RETURNS TABLE(user_id UUID, similarity_score DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.user_id,
    AVG(ABS(cr.rating - target_ratings.rating))::DECIMAL as similarity_score
  FROM public.content_ratings cr
  JOIN (
    SELECT content_id, rating 
    FROM public.content_ratings 
    WHERE user_id = target_user_id
  ) target_ratings ON cr.content_id = target_ratings.content_id
  WHERE cr.user_id != target_user_id
  GROUP BY cr.user_id
  HAVING COUNT(*) >= 3  -- At least 3 common ratings
  ORDER BY similarity_score ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_reviews_updated_at ON public.content_reviews;
CREATE TRIGGER update_content_reviews_updated_at
  BEFORE UPDATE ON public.content_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_watch_parties_updated_at ON public.watch_parties;
CREATE TRIGGER update_watch_parties_updated_at
  BEFORE UPDATE ON public.watch_parties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_metadata_updated_at ON public.content_metadata;
CREATE TRIGGER update_content_metadata_updated_at
  BEFORE UPDATE ON public.content_metadata
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ab_experiments_updated_at ON public.ab_experiments;
CREATE TRIGGER update_ab_experiments_updated_at
  BEFORE UPDATE ON public.ab_experiments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();