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
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl mx-auto p-4">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="w-full h-full rounded-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            src={getStreamUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            title={`Streaming ${movie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-xl font-bold">{movie.title}</h2>
          {(movie.type === 'tv' || movie.type === 'anime') && (
            <p className="text-sm opacity-75">
              Season {season}, Episode {episode}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};