import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ThumbsDown, Share2, X, Calendar, Clock, Globe, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Movie } from '@/types/movie';
import { VideoPlayer } from './VideoPlayer';

interface MovieDetailsProps {
  movie: Movie;
  relatedMovies: Movie[];
  onClose: () => void;
  onRelatedMovieClick: (movie: Movie) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ 
  movie, 
  relatedMovies, 
  onClose,
  onRelatedMovieClick 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleWatchNow = () => {
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
  };

  if (isPlaying) {
    return (
      <VideoPlayer
        movie={movie}
        onClose={handleClosePlayer}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] bg-gradient-to-t from-background via-background/50 to-transparent">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movie.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 pt-20 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end min-h-[50vh]">
            {/* Movie Poster */}
            <div className="lg:col-span-3">
              <div className="w-64 mx-auto lg:mx-0">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-9 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold">{movie.rating}</span>
                  <span className="text-muted-foreground">/ 10</span>
                </div>
                <Badge variant="secondary">{movie.type || 'Movie'}</Badge>
                <Badge variant="outline">HD</Badge>
                <span className="text-muted-foreground">IMDB: N/A</span>
              </div>

              <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
                {movie.title} takes you on an incredible journey filled with adventure, drama, and unforgettable moments. 
                Experience the story that has captivated audiences worldwide with stunning visuals and compelling characters.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  onClick={handleWatchNow}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch now
                </Button>
                <Button variant="outline" size="lg" className="px-6">
                  <Plus className="h-5 w-5 mr-2" />
                  Add to favorite
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLiked(true)}
                  className={liked === true ? "text-green-500" : ""}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Like
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLiked(false)}
                  className={liked === false ? "text-red-500" : ""}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Dislike
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Released:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Country:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Globe className="h-4 w-4" />
                  <span>United States</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Genre:</span>
                <div className="mt-1">
                  <span>{movie.genre}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="container mx-auto px-6 pb-8">
          <h3 className="text-2xl font-bold mb-6">You may also like</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedMovies.slice(0, 12).map((relatedMovie) => (
              <div 
                key={relatedMovie.id}
                className="cursor-pointer group"
                onClick={() => onRelatedMovieClick(relatedMovie)}
              >
                <div className="relative aspect-[2/3] mb-2">
                  <img
                    src={relatedMovie.imageUrl}
                    alt={relatedMovie.title}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 text-xs"
                  >
                    HD
                  </Badge>
                </div>
                <h4 className="font-medium text-sm line-clamp-2 mb-1">{relatedMovie.title}</h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{relatedMovie.year}</span>
                  <Badge variant="outline" className="text-xs">
                    {relatedMovie.type || 'Movie'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};