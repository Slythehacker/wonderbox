import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MovieSection from '@/components/MovieSection';
import { MovieDetails } from '@/components/MovieDetails';
import Footer from '@/components/Footer';
import { useMovieData } from '@/hooks/useMovieData';
import { Movie } from '@/types/movie';
import { Loader2 } from 'lucide-react';

const Movies: React.FC = () => {
  const { movies, trendingMovies, topRatedMovies, upcomingMovies, loading, error } = useMovieData();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMovie(null);
  };

  const handleRelatedMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
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
          <p className="text-destructive">Error loading movies: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Movies</h1>
            <p className="text-muted-foreground">
              Discover the latest and greatest movies to stream
            </p>
          </div>
          
          <div className="space-y-8">
            {movies.length > 0 && (
              <MovieSection 
                title="Popular Movies" 
                movies={movies}
                onStreamClick={handleMovieClick}
              />
            )}
            
            {trendingMovies.length > 0 && (
              <MovieSection 
                title="Now Playing" 
                movies={trendingMovies}
                onStreamClick={handleMovieClick}
              />
            )}
            
            {topRatedMovies.length > 0 && (
              <MovieSection 
                title="Top Rated Movies" 
                movies={topRatedMovies}
                onStreamClick={handleMovieClick}
              />
            )}
            
            {upcomingMovies.length > 0 && (
              <MovieSection 
                title="Upcoming Movies" 
                movies={upcomingMovies}
                onStreamClick={handleMovieClick}
              />
            )}

            {(() => {
              const actionMovies = movies.filter(m => m.genre.toLowerCase().includes('action'));
              return actionMovies.length > 0 && (
                <MovieSection 
                  title="Action Movies" 
                  movies={actionMovies}
                  onStreamClick={handleMovieClick}
                />
              );
            })()}

            {(() => {
              const comedyMovies = movies.filter(m => m.genre.toLowerCase().includes('comedy'));
              return comedyMovies.length > 0 && (
                <MovieSection 
                  title="Comedy Movies" 
                  movies={comedyMovies}
                  onStreamClick={handleMovieClick}
                />
              );
            })()}

            {(() => {
              const dramaMovies = movies.filter(m => m.genre.toLowerCase().includes('drama'));
              return dramaMovies.length > 0 && (
                <MovieSection 
                  title="Drama Movies" 
                  movies={dramaMovies}
                  onStreamClick={handleMovieClick}
                />
              );
            })()}
          </div>
        </div>
      </main>

      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          relatedMovies={movies.filter(m => m.id !== selectedMovie.id && 
            (m.genre === selectedMovie.genre || m.year === selectedMovie.year))}
          onClose={handleCloseDetails}
          onRelatedMovieClick={handleRelatedMovieClick}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Movies;