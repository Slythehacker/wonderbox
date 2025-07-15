import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MovieSection from '@/components/MovieSection';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useMovieData } from '@/hooks/useMovieData';
import { Movie } from '@/types/movie';
import { Loader2 } from 'lucide-react';

const TVShows: React.FC = () => {
  const { popularTvShows, topRatedTvShows, airingTodayTvShows, loading, error } = useMovieData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleStreamClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
          <p className="text-destructive">Error loading TV shows: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">TV Shows</h1>
            <p className="text-muted-foreground">
              Binge-watch the best TV series and shows
            </p>
          </div>
          
          <div className="space-y-8">
            <MovieSection 
              title="Popular TV Shows" 
              movies={popularTvShows}
              onStreamClick={handleStreamClick}
            />
            
            <MovieSection 
              title="Top Rated TV Shows" 
              movies={topRatedTvShows}
              onStreamClick={handleStreamClick}
            />
            
            <MovieSection 
              title="Airing Today" 
              movies={airingTodayTvShows}
              onStreamClick={handleStreamClick}
            />
          </div>
        </div>
      </main>

      {isPlaying && selectedMovie && (
        <VideoPlayer
          movie={{
            id: selectedMovie.id,
            title: selectedMovie.title,
            type: selectedMovie.type || 'tv'
          }}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default TVShows;