import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MovieSection from '@/components/MovieSection';
import { MovieDetails } from '@/components/MovieDetails';
import Footer from '@/components/Footer';
import { useMovieData } from '@/hooks/useMovieData';
import { Movie } from '@/types/movie';
import { Loader2 } from 'lucide-react';

const Anime: React.FC = () => {
  const { topAnime, popularAnime, loading, error } = useMovieData();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleAnimeClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMovie(null);
  };

  const handleRelatedAnimeClick = (movie: Movie) => {
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
          <p className="text-destructive">Error loading anime: {error}</p>
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
            <h1 className="text-4xl font-bold mb-4">Anime</h1>
            <p className="text-muted-foreground">
              Explore amazing anime series and movies
            </p>
          </div>
          
          <div className="space-y-8">
            {topAnime.length > 0 && (
              <MovieSection 
                title="Top Anime" 
                movies={topAnime}
                onStreamClick={handleAnimeClick}
              />
            )}
            
            {popularAnime.length > 0 && (
              <MovieSection 
                title="Popular Anime" 
                movies={popularAnime}
                onStreamClick={handleAnimeClick}
              />
            )}

            {(() => {
              const actionAnime = popularAnime.filter(m => m.genre.toLowerCase().includes('action'));
              return actionAnime.length > 0 && (
                <MovieSection 
                  title="Action Anime" 
                  movies={actionAnime}
                  onStreamClick={handleAnimeClick}
                />
              );
            })()}

            {(() => {
              const romanceAnime = topAnime.filter(m => m.genre.toLowerCase().includes('romance'));
              return romanceAnime.length > 0 && (
                <MovieSection 
                  title="Romance Anime" 
                  movies={romanceAnime}
                  onStreamClick={handleAnimeClick}
                />
              );
            })()}

            {(() => {
              const comedyAnime = popularAnime.filter(m => m.genre.toLowerCase().includes('comedy'));
              return comedyAnime.length > 0 && (
                <MovieSection 
                  title="Comedy Anime" 
                  movies={comedyAnime}
                  onStreamClick={handleAnimeClick}
                />
              );
            })()}

            {(() => {
              const supernaturalAnime = topAnime.filter(m => m.genre.toLowerCase().includes('supernatural') || m.genre.toLowerCase().includes('fantasy'));
              return supernaturalAnime.length > 0 && (
                <MovieSection 
                  title="Supernatural Anime" 
                  movies={supernaturalAnime}
                  onStreamClick={handleAnimeClick}
                />
              );
            })()}
          </div>
        </div>
      </main>

      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          relatedMovies={popularAnime.filter(m => m.id !== selectedMovie.id && 
            (m.genre === selectedMovie.genre || m.year === selectedMovie.year))}
          onClose={handleCloseDetails}
          onRelatedMovieClick={handleRelatedAnimeClick}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Anime;