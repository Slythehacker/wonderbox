import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
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

  const getStreamUrl = () => {
    const { id, type } = movie;
    
    switch (type) {
      case 'movie':
      case 'movies':
        return `https://vidsrc.net/embed/movie/${id}`;
      case 'anime':
        return `https://vidsrc.net/embed/movie/${id}`;
      case 'tv':
      case 'tv_show':
        return `https://vidsrc.net/embed/tv/${id}/${season}/${episode}`;
      default:
        // Default to movie if type is not specified
        return `https://vidsrc.net/embed/movie/${id}`;
    }
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
          <iframe
            ref={iframeRef}
            src={getStreamUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            title={`Streaming ${movie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          
          {/* Gradient overlay for better aesthetics */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
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
                    <span className="text-white">vidsrc.net</span>
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
              <span className="text-white">vidsrc.net</span>
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