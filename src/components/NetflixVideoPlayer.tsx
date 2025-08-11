import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  Subtitles,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface NetflixVideoPlayerProps {
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

export const NetflixVideoPlayer: React.FC<NetflixVideoPlayerProps> = ({ 
  movie, 
  season = 1, 
  episode = 1, 
  onClose 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentSource, setCurrentSource] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);
  const [showInfo, setShowInfo] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const streamingSources = [
    {
      name: 'VidSrc',
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
      name: 'VidSrc Pro',
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
      name: 'MultiMovies',
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
    }
  ];

  const getStreamUrl = () => {
    const source = streamingSources[currentSource];
    return source.getUrl(movie.id, movie.type);
  };

  const tryNextSource = () => {
    if (currentSource < streamingSources.length - 1) {
      setCurrentSource(currentSource + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
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
      setShowControls(false);
    }, 3000);
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [onClose, isPlaying, controlsTimeout]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Netflix-style loading screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Loading Content</h3>
            <p className="text-white/70">Streaming from {streamingSources[currentSource].name}</p>
            {currentSource > 0 && (
              <p className="text-sm text-white/50 mt-2">
                Trying source {currentSource + 1} of {streamingSources.length}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">😞</div>
            <h3 className="text-white text-2xl font-bold mb-4">Content Unavailable</h3>
            <p className="text-white/70 mb-8 leading-relaxed">
              We're having trouble playing this title right now. Please check your connection or try again later.
            </p>
            <div className="space-y-3">
              <Button
                onClick={resetSources}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold"
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
          <iframe
            ref={iframeRef}
            src={getStreamUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            title={`Streaming ${movie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsLoading(false)}
            onError={() => tryNextSource()}
          />
        )}

        {/* Netflix-style Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-12 w-12 rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Center Play Button (when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="icon"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 h-20 w-20 rounded-full"
                onClick={() => setIsPlaying(true)}
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
                onValueChange={setProgress}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <div className="w-24">
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
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
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                >
                  <Subtitles className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Info Panel */}
        {showInfo && (
          <div className="absolute top-0 right-0 w-96 h-full bg-black/95 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-white text-2xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-white/70 mb-4">
                  <span>{movie.year || "2024"}</span>
                  <span>{movie.rating || "8.5"}/10</span>
                  <span className="px-2 py-1 bg-white/20 rounded text-xs">HD</span>
                </div>
                {(movie.type === 'tv' || movie.type === 'anime') && (
                  <div className="text-white/70 text-sm mb-4">
                    Season {season} • Episode {episode}
                  </div>
                )}
              </div>

              <p className="text-white/80 leading-relaxed">
                {movie.description || "Experience this incredible story that will take you on an unforgettable journey through amazing characters and breathtaking scenes."}
              </p>

              <div className="flex items-center space-x-3">
                <Button className="bg-white text-black hover:bg-white/90 flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  My List
                </Button>
                <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-white/60 text-sm">Genre: </span>
                  <span className="text-white">{movie.genre || "Action, Drama"}</span>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Source: </span>
                  <span className="text-white">{streamingSources[currentSource].name}</span>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Quality: </span>
                  <span className="text-white">Full HD</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};