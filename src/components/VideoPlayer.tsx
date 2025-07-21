import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  movie: {
    id: string;
    title: string;
    type?: string;
  };
  season?: number;
  episode?: number;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  movie, 
  season = 1, 
  episode = 1, 
  onClose 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentSource, setCurrentSource] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close button - floating */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:bg-black/50 h-12 w-12 rounded-full backdrop-blur-sm border border-white/20"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Main video area */}
      <div className="h-full w-full flex flex-col lg:flex-row">
        {/* Video player - takes full space on mobile */}
        <div className="flex-1 relative bg-black">
          {hasError ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
              <div className="text-6xl mb-4">😞</div>
              <h3 className="text-xl font-semibold mb-2">Content Unavailable</h3>
              <p className="text-white/70 text-center mb-6 max-w-md">
                We're having trouble loading this content. All available sources have been tried.
              </p>
              <Button
                onClick={resetSources}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <>
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
              
              {isLoading && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading from {streamingSources[currentSource].name}...</p>
                    {currentSource > 0 && (
                      <p className="text-sm text-white/70 mt-2">
                        Trying alternative source {currentSource + 1} of {streamingSources.length}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Gradient overlay for better aesthetics */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </>
          )}
        </div>

        {/* Info panel - collapsible on mobile */}
        <div className="lg:w-80 bg-black/95 backdrop-blur-lg border-t lg:border-t-0 lg:border-l border-white/10">
          {/* Mobile title bar */}
          <div className="lg:hidden p-4 border-b border-white/10">
            <h2 className="text-white font-semibold text-lg truncate">{movie.title}</h2>
            <div className="flex items-center space-x-2 text-sm text-white/60 mt-1">
              <span className="capitalize">{movie.type || 'Movie'}</span>
              {(movie.type === 'tv' || movie.type === 'anime') && (
                <span>• S{season}E{episode}</span>
              )}
            </div>
          </div>

          {/* Desktop content */}
          <div className="hidden lg:block p-6">
            <h3 className="text-white font-semibold text-xl mb-6">{movie.title}</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Source:</span>
                    <span className="text-white">{streamingSources[currentSource].name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Type:</span>
                    <span className="text-white capitalize">{movie.type || 'Movie'}</span>
                  </div>
                  {(movie.type === 'tv' || movie.type === 'anime') && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/60">Season:</span>
                        <span className="text-white">{season}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Episode:</span>
                        <span className="text-white">{episode}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-primary font-medium">Now Playing</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-3 bg-white/5 rounded border border-white/10">
              <p className="text-xs text-white/50 leading-relaxed">
                If any content infringes on your rights, please contact us. This content is provided by third-party sources.
              </p>
            </div>
          </div>

          {/* Mobile quick info */}
          <div className="lg:hidden p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Source:</span>
              <span className="text-white">{streamingSources[currentSource].name}</span>
            </div>
            {(movie.type === 'tv' || movie.type === 'anime') && (
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className="text-white/60">S{season}</span>
                <span className="text-white/60">•</span>
                <span className="text-white/60">E{episode}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};