import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  RotateCcw,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Hls from 'hls.js';

interface EnhancedVideoPlayerProps {
  movie: {
    id: string;
    title: string;
    type?: string;
    description?: string;
    year?: string;
    rating?: number;
    duration?: string;
    genre?: string;
  };
  season?: number;
  episode?: number;
  onClose: () => void;
}

export const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({ 
  movie, 
  season = 1, 
  episode = 1, 
  onClose 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [currentSource, setCurrentSource] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Enhanced streaming sources with multiple formats and fallbacks
  const streamingSources = [
    {
      name: 'VidSrc Prime',
      type: 'iframe',
      getUrl: (id: string, type?: string) => {
        switch (type) {
          case 'movie':
          case 'movies':
            return `https://vidsrc.xyz/embed/movie/${id}`;
          case 'anime':
            return `https://vidsrc.xyz/embed/movie/${id}`;
          case 'tv':
          case 'tv_show':
            return `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`;
          default:
            return `https://vidsrc.xyz/embed/movie/${id}`;
        }
      }
    },
    {
      name: 'VidSrc Pro',
      type: 'iframe',
      getUrl: (id: string, type?: string) => {
        switch (type) {
          case 'movie':
          case 'movies':
            return `https://vidsrc.pro/embed/movie/${id}`;
          case 'anime':
            return `https://vidsrc.pro/embed/movie/${id}`;
          case 'tv':
          case 'tv_show':
            return `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`;
          default:
            return `https://vidsrc.pro/embed/movie/${id}`;
        }
      }
    },
    {
      name: 'SuperEmbed',
      type: 'iframe',
      getUrl: (id: string, type?: string) => {
        switch (type) {
          case 'movie':
          case 'movies':
            return `https://multiembed.mov/?video_id=${id}&tmdb=1`;
          case 'anime':
            return `https://multiembed.mov/?video_id=${id}&tmdb=1`;
          case 'tv':
          case 'tv_show':
            return `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
          default:
            return `https://multiembed.mov/?video_id=${id}&tmdb=1`;
        }
      }
    },
    {
      name: 'VidSrc Classic',
      type: 'iframe',
      getUrl: (id: string, type?: string) => {
        switch (type) {
          case 'movie':
          case 'movies':
            return `https://vidsrc.to/embed/movie/${id}`;
          case 'anime':
            return `https://vidsrc.to/embed/movie/${id}`;
          case 'tv':
          case 'tv_show':
            return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
          default:
            return `https://vidsrc.to/embed/movie/${id}`;
        }
      }
    },
    {
      name: 'EmbedSu',
      type: 'iframe', 
      getUrl: (id: string, type?: string) => {
        switch (type) {
          case 'movie':
          case 'movies':
            return `https://embed.su/embed/movie/${id}`;
          case 'anime':
            return `https://embed.su/embed/movie/${id}`;
          case 'tv':
          case 'tv_show':
            return `https://embed.su/embed/tv/${id}/${season}/${episode}`;
          default:
            return `https://embed.su/embed/movie/${id}`;
        }
      }
    }
  ];

  const getCurrentSource = () => streamingSources[currentSource];
  const getStreamUrl = () => getCurrentSource().getUrl(movie.id, movie.type);

  const tryNextSource = () => {
    if (currentSource < streamingSources.length - 1) {
      setCurrentSource(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const resetSources = () => {
    setCurrentSource(0);
    setIsLoading(true);
    setHasError(false);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume[0] / 100;
      setIsMuted(newVolume[0] === 0);
    }
  };

  const handleProgressChange = (newProgress: number[]) => {
    setProgress(newProgress);
    if (videoRef.current && duration > 0) {
      videoRef.current.currentTime = (newProgress[0] / 100) * duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration > 0) {
        setProgress([(video.currentTime / video.duration) * 100]);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      console.error('Video error, trying next source...');
      tryNextSource();
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // Keyboard controls and fullscreen detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = 'unset';
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [onClose, isPlaying, controlsTimeout]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-center">
            <div className="relative mb-6">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Loading Content</h3>
            <p className="text-white/70 mb-2">Streaming from {getCurrentSource().name}</p>
            {currentSource > 0 && (
              <Badge variant="outline" className="border-primary/20 text-primary/80">
                Source {currentSource + 1} of {streamingSources.length}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">🎬</div>
            <h3 className="text-white text-2xl font-bold mb-4">Content Temporarily Unavailable</h3>
            <p className="text-white/70 mb-8 leading-relaxed">
              We've tried all available sources but couldn't load this content. This might be temporary.
            </p>
            <div className="space-y-3">
              <Button
                onClick={resetSources}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-semibold"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back to Browse
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Container */}
      <div className="relative w-full h-full">
        {!hasError && (
          <>
            {/* Video Element for HLS streams */}
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black hidden"
              controls={false}
              autoPlay
              playsInline
            />
            
            {/* Iframe for embed sources */}
            <iframe
              src={getStreamUrl()}
              className="w-full h-full border-0"
              allowFullScreen
              title={`Streaming ${movie.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              onLoad={() => setIsLoading(false)}
              onError={() => tryNextSource()}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </>
        )}

        {/* Enhanced Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-12 w-12 rounded-full backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-2">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {getCurrentSource().name}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                HD
              </Badge>
            </div>
          </div>

          {/* Center Play Button (when paused) */}
          {!isPlaying && !isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="icon"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 h-20 w-20 rounded-full"
                onClick={togglePlay}
              >
                <Play className="h-8 w-8 text-white ml-1" />
              </Button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={progress}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/70 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime -= 10;
                    }
                  }}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime += 10;
                    }
                  }}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <div className="w-24">
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="text-white text-sm font-medium">
                  {movie.duration || "2h 15m"}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => tryNextSource()}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                  disabled={currentSource >= streamingSources.length - 1}
                >
                  <Settings className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="absolute top-20 left-6 max-w-md">
          <h1 className="text-white text-2xl font-bold mb-2">{movie.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-white/70 mb-4">
            <span>{movie.year || "2024"}</span>
            <span>⭐ {movie.rating || "8.5"}</span>
            {(movie.type === 'tv' || movie.type === 'anime') && (
              <span>S{season}E{episode}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};