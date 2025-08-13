-- Add RLS policies for playback analytics tables

-- Enable RLS on all playback tables
ALTER TABLE public.playback_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playback_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playback_qoe ENABLE ROW LEVEL SECURITY;

-- Playback Sessions Policies
CREATE POLICY "Users can view their own playback sessions"
ON public.playback_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playback sessions"
ON public.playback_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playback sessions"
ON public.playback_sessions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playback sessions"
ON public.playback_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- Playback Events Policies
CREATE POLICY "Users can view their own playback events"
ON public.playback_events
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playback events"
ON public.playback_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playback events"
ON public.playback_events
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playback events"
ON public.playback_events
FOR DELETE
USING (auth.uid() = user_id);

-- Playback QoE Policies
CREATE POLICY "Users can view their own playback qoe"
ON public.playback_qoe
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playback qoe"
ON public.playback_qoe
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playback qoe"
ON public.playback_qoe
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playback qoe"
ON public.playback_qoe
FOR DELETE
USING (auth.uid() = user_id);