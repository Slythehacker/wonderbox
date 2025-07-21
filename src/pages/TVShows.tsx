import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MovieSection from '@/components/MovieSection';
import { MovieDetails } from '@/components/MovieDetails';
import Footer from '@/components/Footer';
import { useMovieData } from '@/hooks/useMovieData';
import { Movie } from '@/types/movie';
import { Loader2 } from 'lucide-react';

const TVShows: React.FC = () => {
  const { popularTvShows, topRatedTvShows, airingTodayTvShows, loading, error } = useMovieData();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleTVShowClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMovie(null);
  };

  const handleRelatedShowClick = (movie: Movie) => {
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
          <p className="text-destructive">Error loading TV shows: {error}</p>
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
            <h1 className="text-4xl font-bold mb-4">TV Shows</h1>
            <p className="text-muted-foreground">
              Binge-watch the best TV series and shows
            </p>
          </div>
          
          <div className="space-y-8">
            {popularTvShows.length > 0 && (
              <MovieSection 
                title="Popular TV Shows" 
                movies={popularTvShows}
                onStreamClick={handleTVShowClick}
              />
            )}
            
            {topRatedTvShows.length > 0 && (
              <MovieSection 
                title="Top Rated TV Shows" 
                movies={topRatedTvShows}
                onStreamClick={handleTVShowClick}
              />
            )}
            
            {airingTodayTvShows.length > 0 && (
              <MovieSection 
                title="Airing Today" 
                movies={airingTodayTvShows}
                onStreamClick={handleTVShowClick}
              />
            )}

            {(() => {
              const crimeShows = popularTvShows.filter(m => m.genre.toLowerCase().includes('crime') || m.genre.toLowerCase().includes('thriller'));
              return crimeShows.length > 0 && (
                <MovieSection 
                  title="Crime & Thriller Shows" 
                  movies={crimeShows}
                  onStreamClick={handleTVShowClick}
                />
              );
            })()}

            {(() => {
              const comedyShows = popularTvShows.filter(m => m.genre.toLowerCase().includes('comedy'));
              return comedyShows.length > 0 && (
                <MovieSection 
                  title="Comedy Series" 
                  movies={comedyShows}
                  onStreamClick={handleTVShowClick}
                />
              );
            })()}

            {(() => {
              const scifiShows = popularTvShows.filter(m => m.genre.toLowerCase().includes('sci-fi') || m.genre.toLowerCase().includes('fantasy'));
              return scifiShows.length > 0 && (
                <MovieSection 
                  title="Sci-Fi & Fantasy" 
                  movies={scifiShows}
                  onStreamClick={handleTVShowClick}
                />
              );
            })()}

            {(() => {
              const docShows = topRatedTvShows.filter(m => m.genre.toLowerCase().includes('documentary'));
              return docShows.length > 0 && (
                <MovieSection 
                  title="Documentary Series" 
                  movies={docShows}
                  onStreamClick={handleTVShowClick}
                />
              );
            })()}
          </div>
        </div>
      </main>

      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          relatedMovies={popularTvShows.filter(m => m.id !== selectedMovie.id && 
            (m.genre === selectedMovie.genre || m.year === selectedMovie.year))}
          onClose={handleCloseDetails}
          onRelatedMovieClick={handleRelatedShowClick}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default TVShows;