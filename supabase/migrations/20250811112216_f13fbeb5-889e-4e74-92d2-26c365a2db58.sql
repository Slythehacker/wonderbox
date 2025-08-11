-- Phase 4: QoE metrics & experimentation foundational tables

-- 1) Playback sessions
CREATE TABLE IF NOT EXISTS public.playback_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('movie','tv','anime')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  device TEXT,
  player_version TEXT,
  network_type TEXT,
  cdn TEXT,
  experiment_variant TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Playback events (telemetry)
CREATE TABLE IF NOT EXISTS public.playback_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.playback_sessions(id) ON DELETE CASCADE,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  position_seconds NUMERIC,
  buffered_seconds NUMERIC,
  bitrate_kbps INTEGER,
  dropped_frames INTEGER,
  error_code TEXT,
  error_message TEXT,
  cdn_node TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Playback QoE summary (aggregated)
CREATE TABLE IF NOT EXISTS public.playback_qoe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID UNIQUE NOT NULL REFERENCES public.playback_sessions(id) ON DELETE CASCADE,
  user_id UUID,
  startup_time_ms INTEGER,
  rebuffer_count INTEGER,
  total_rebuffer_ms INTEGER,
  watch_time_ms INTEGER,
  exited_early BOOLEAN,
  mean_bitrate_kbps INTEGER,
  max_bitrate_kbps INTEGER,
  min_bitrate_kbps INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_playback_events_session_id ON public.playback_events(session_id);
CREATE INDEX IF NOT EXISTS idx_playback_sessions_user_id ON public.playback_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_playback_events_user_id ON public.playback_events(user_id);
CREATE INDEX IF NOT EXISTS idx_playback_qoe_user_id ON public.playback_qoe(user_id);

-- Enable RLS
ALTER TABLE public.playback_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playback_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playback_qoe ENABLE ROW LEVEL SECURITY;

-- RLS policies: Owners-only access; allow anonymous inserts when user_id is NULL (for unauthenticated playback)
-- Sessions
CREATE POLICY IF NOT EXISTS "Users can view their own sessions"
ON public.playback_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own sessions"
ON public.playback_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Users can update their own sessions"
ON public.playback_sessions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own sessions"
ON public.playback_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Events
CREATE POLICY IF NOT EXISTS "Users can view their own events"
ON public.playback_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create events for their sessions"
ON public.playback_events FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- QoE
CREATE POLICY IF NOT EXISTS "Users can view their own QoE"
ON public.playback_qoe FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can upsert QoE for their sessions"
ON public.playback_qoe FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Users can update their QoE"
ON public.playback_qoe FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Timestamp triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_playback_sessions_updated_at ON public.playback_sessions;
CREATE TRIGGER trg_playback_sessions_updated_at
BEFORE UPDATE ON public.playback_sessions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_playback_qoe_updated_at ON public.playback_qoe;
CREATE TRIGGER trg_playback_qoe_updated_at
BEFORE UPDATE ON public.playback_qoe
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();