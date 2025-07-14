import React from 'react';
import Navbar from '@/components/Navbar';
import MovieSection from '@/components/MovieSection';
import { useMovieData } from '@/hooks/useMovieData';
import { Loader2 } from 'lucide-react';

const Movies: React.FC = () => {
  const { movies, loading, error } = useMovieData();

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
          <p className="text-destructive">Error loading movies: {error}</p>
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
            <h1 className="text-4xl font-bold mb-4">Movies</h1>
            <p className="text-muted-foreground">
              Discover the latest and greatest movies to stream
            </p>
          </div>
          
          <MovieSection 
            title="Popular Movies" 
            movies={movies}
          />
        </div>
      </main>
    </div>
  );
};

export default Movies;