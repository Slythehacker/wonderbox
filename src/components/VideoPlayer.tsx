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
        return `https://vidsrc.icu/embed/movie/${id}`;
      case 'anime':
        // Default to dub=1 and skip=1 for anime
        return `https://vidsrc.icu/embed/anime/${id}/${episode}/1/1`;
      case 'tv':
        return `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
      default:
        // Default to movie if type is not specified
        return `https://vidsrc.icu/embed/movie/${id}`;
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
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header with breadcrumb and close button */}
      <div className="flex items-center justify-between p-4 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center space-x-2 text-sm text-white/70">
          <span>Home</span>
          <span>&gt;</span>
          <span className="text-white">{movie.title}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10 h-8 w-8"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Video player */}
        <div className="flex-1 relative bg-black">
          <iframe
            ref={iframeRef}
            src={getStreamUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            title={`Streaming ${movie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Resources sidebar */}
        <div className="w-80 bg-gray-900/95 backdrop-blur-sm border-l border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-white/60">Source: </span>
              <span className="text-white">vidsrc.icu</span>
            </div>
            
            <div className="text-sm">
              <span className="text-white/60">Type: </span>
              <span className="text-white capitalize">{movie.type || 'Movie'}</span>
            </div>

            {(movie.type === 'tv' || movie.type === 'anime') && (
              <>
                <div className="text-sm">
                  <span className="text-white/60">Season: </span>
                  <span className="text-white">{season}</span>
                </div>
                <div className="text-sm">
                  <span className="text-white/60">Episode: </span>
                  <span className="text-white">{episode}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 p-3 bg-primary/20 rounded-lg border border-primary/30">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-primary font-medium text-sm">{movie.title}</span>
            </div>
          </div>

          <div className="mt-8 text-xs text-white/40">
            <p>Find any content infringes on your rights, please contact us.</p>
          </div>
        </div>
      </div>
    </div>
  );
};