import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface PlaybackSession {
  id: string;
  content_id: string;
  content_type: string;
  started_at: string;
  device: string;
  player_version: string;
  network_type: string;
  cdn: string;
  experiment_variant?: string;
}

interface PlaybackEvent {
  event_type: string;
  position_seconds?: number;
  buffered_seconds?: number;
  bitrate_kbps?: number;
  dropped_frames?: number;
  error_code?: string;
  error_message?: string;
  cdn_node?: string;
}

interface QoEMetrics {
  startup_time_ms: number;
  rebuffer_count: number;
  total_rebuffer_ms: number;
  watch_time_ms: number;
  exited_early: boolean;
  mean_bitrate_kbps: number;
  max_bitrate_kbps: number;
  min_bitrate_kbps: number;
}

export const usePlaybackAnalytics = () => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<PlaybackSession | null>(null);
  const [qoeMetrics, setQoeMetrics] = useState<Partial<QoEMetrics>>({});
  const sessionStartTime = useRef<number>(0);
  const lastPosition = useRef<number>(0);
  const bitrateHistory = useRef<number[]>([]);

  const startSession = async (contentId: string, contentType: string) => {
    const sessionData = {
      user_id: user?.id || null,
      content_id: contentId,
      content_type: contentType,
      device: getDeviceInfo(),
      player_version: '1.0.0',
      network_type: getNetworkType(),
      cdn: 'vidsrc',
      experiment_variant: getExperimentVariant()
    };

    try {
      const { data, error } = await supabase
        .from('playback_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      sessionStartTime.current = Date.now();
      setQoeMetrics({
        startup_time_ms: 0,
        rebuffer_count: 0,
        total_rebuffer_ms: 0,
        watch_time_ms: 0,
        exited_early: false,
        mean_bitrate_kbps: 0,
        max_bitrate_kbps: 0,
        min_bitrate_kbps: 0
      });
    } catch (error) {
      console.error('Failed to start playback session:', error);
    }
  };

  const trackEvent = async (event: PlaybackEvent) => {
    if (!currentSession) return;

    const eventData = {
      session_id: currentSession.id,
      user_id: user?.id || null,
      ...event
    };

    try {
      await supabase.from('playback_events').insert(eventData);
      
      // Update QoE metrics based on event
      updateQoEMetrics(event);
    } catch (error) {
      console.error('Failed to track playback event:', error);
    }
  };

  const updateQoEMetrics = (event: PlaybackEvent) => {
    setQoeMetrics(prev => {
      const updated = { ...prev };

      switch (event.event_type) {
        case 'startup_complete':
          updated.startup_time_ms = Date.now() - sessionStartTime.current;
          break;
        case 'rebuffer_start':
          updated.rebuffer_count = (updated.rebuffer_count || 0) + 1;
          break;
        case 'rebuffer_end':
          // Track rebuffer duration if available
          break;
        case 'bitrate_change':
          if (event.bitrate_kbps) {
            bitrateHistory.current.push(event.bitrate_kbps);
            updated.max_bitrate_kbps = Math.max(updated.max_bitrate_kbps || 0, event.bitrate_kbps);
            updated.min_bitrate_kbps = updated.min_bitrate_kbps 
              ? Math.min(updated.min_bitrate_kbps, event.bitrate_kbps)
              : event.bitrate_kbps;
            updated.mean_bitrate_kbps = Math.round(
              bitrateHistory.current.reduce((a, b) => a + b, 0) / bitrateHistory.current.length
            );
          }
          break;
        case 'position_update':
          if (event.position_seconds) {
            lastPosition.current = event.position_seconds;
            updated.watch_time_ms = event.position_seconds * 1000;
          }
          break;
      }

      return updated;
    });
  };

  const endSession = async (exitedEarly: boolean = false) => {
    if (!currentSession) return;

    try {
      // Update session end time
      await supabase
        .from('playback_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', currentSession.id);

      // Save final QoE metrics
      const finalMetrics = {
        ...qoeMetrics,
        exited_early: exitedEarly,
        watch_time_ms: lastPosition.current * 1000
      };

      await supabase
        .from('playback_qoe')
        .upsert({
          session_id: currentSession.id,
          user_id: user?.id || null,
          ...finalMetrics
        });

      setCurrentSession(null);
      setQoeMetrics({});
      bitrateHistory.current = [];
    } catch (error) {
      console.error('Failed to end playback session:', error);
    }
  };

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(ua)) return 'mobile';
    if (/Tablet/.test(ua)) return 'tablet';
    return 'desktop';
  };

  const getNetworkType = () => {
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType || 'unknown';
  };

  const getExperimentVariant = () => {
    // Simple A/B testing - could be more sophisticated
    return Math.random() > 0.5 ? 'variant_a' : 'variant_b';
  };

  return {
    currentSession,
    qoeMetrics,
    startSession,
    trackEvent,
    endSession
  };
};