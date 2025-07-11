import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Download, Heart, Star, Plus, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Movie } from '@/types/movie';

interface StreamingMovieCardProps {
  movie: Movie;
}

const StreamingMovieCard = ({ movie }: StreamingMovieCardProps) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add movies to your watchlist."
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movie.id);

        if (error) throw error;
        
        setIsInWatchlist(false);
        toast({
          title: "Removed from watchlist",
          description: `${movie.title} has been removed from your watchlist.`
        });
      } else {
        // Add to watchlist
        const { error } = await supabase
          .from('watchlist')
          .insert({
            user_id: user.id,
            movie_id: movie.id,
            movie_title: movie.title,
            movie_type: movie.type || 'movie',
            movie_image_url: movie.imageUrl
          });

        if (error) throw error;
        
        setIsInWatchlist(true);
        toast({
          title: "Added to watchlist",
          description: `${movie.title} has been added to your watchlist.`
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to stream content."
      });
      return;
    }
    
    // In a real streaming app, this would open the video player
    toast({
      title: "Streaming Feature",
      description: "This would open the video player in a real streaming platform. Currently showing demo content from APIs."
    });
  };

  const handleDownloadClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to download content."
      });
      return;
    }
    
    // In a real streaming app, this would initiate download
    toast({
      title: "Download Feature",
      description: "This would start downloading the content in a real streaming platform."
    });
  };

  return (
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          {/* Top actions */}
          <div className="flex justify-between">
            <Badge variant="secondary" className="bg-black/80 text-white border-none">
              {movie.genre}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleWatchlistToggle}
              disabled={isLoading}
            >
              {isInWatchlist ? (
                <Check className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Center play button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="rounded-full bg-primary/90 hover:bg-primary text-primary-foreground"
              onClick={handleStreamClick}
            >
              <Play className="h-6 w-6 ml-1" fill="currentColor" />
            </Button>
          </div>

          {/* Bottom actions */}
          <div className="flex justify-between items-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={handleDownloadClick}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <div className="flex items-center space-x-1 text-white">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{movie.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamingMovieCard;