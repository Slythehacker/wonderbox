import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import EnhancedCarousel from '@/components/EnhancedCarousel';
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
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 py-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Movies
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover unlimited entertainment with our vast collection of movies. 
              From blockbuster hits to indie gems, find your next favorite film.
            </p>
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{movies.length}+</div>
                <div className="text-sm text-muted-foreground">Movies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4K</div>
                <div className="text-sm text-muted-foreground">Ultra HD</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Streaming</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pb-20">
        <div className="space-y-16">
          {movies.length > 0 && (
            <EnhancedCarousel 
              title="🎬 Popular Movies" 
              subtitle="Blockbuster hits everyone's talking about"
              featured={true}
              cardSize="lg"
              items={movies.map(movie => ({
                ...movie,
                year: movie.year || "2024",
                genre: movie.genre || "Action",
                imageUrl: movie.imageUrl || "/placeholder.svg",
              }))}
              onItemClick={handleMovieClick}
            />
          )}
          
          {trendingMovies.length > 0 && (
            <EnhancedCarousel 
              title="🔥 Now Playing" 
              subtitle="Latest releases in theaters and streaming"
              items={trendingMovies.map(movie => ({
                ...movie,
                year: movie.year || "2024",
                genre: movie.genre || "Action",
                imageUrl: movie.imageUrl || "/placeholder.svg",
              }))}
              onItemClick={handleMovieClick}
            />
          )}
          
          {topRatedMovies.length > 0 && (
            <EnhancedCarousel 
              title="⭐ Top Rated Movies" 
              subtitle="Critically acclaimed masterpieces"
              items={topRatedMovies.map(movie => ({
                ...movie,
                year: movie.year || "2024",
                genre: movie.genre || "Action",
                imageUrl: movie.imageUrl || "/placeholder.svg",
              }))}
              onItemClick={handleMovieClick}
            />
          )}
          
          {upcomingMovies.length > 0 && (
            <EnhancedCarousel 
              title="🎯 Coming Soon" 
              subtitle="Get ready for these upcoming releases"
              items={upcomingMovies.map(movie => ({
                ...movie,
                year: movie.year || "2024",
                genre: movie.genre || "Action",
                imageUrl: movie.imageUrl || "/placeholder.svg",
              }))}
              onItemClick={handleMovieClick}
            />
          )}

          {/* Genre Collections */}
          {(() => {
            const actionMovies = movies.filter(m => m.genre.toLowerCase().includes('action'));
            return actionMovies.length > 0 && (
              <EnhancedCarousel 
                title="💥 Action & Adventure" 
                subtitle="High-octane thrills and heart-pumping excitement"
                items={actionMovies.map(movie => ({
                  ...movie,
                  year: movie.year || "2024",
                  genre: movie.genre || "Action",
                  imageUrl: movie.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleMovieClick}
              />
            );
          })()}

          {(() => {
            const comedyMovies = movies.filter(m => m.genre.toLowerCase().includes('comedy'));
            return comedyMovies.length > 0 && (
              <EnhancedCarousel 
                title="😂 Comedy Central" 
                subtitle="Laugh-out-loud entertainment for every mood"
                items={comedyMovies.map(movie => ({
                  ...movie,
                  year: movie.year || "2024",
                  genre: movie.genre || "Comedy",
                  imageUrl: movie.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleMovieClick}
              />
            );
          })()}

          {(() => {
            const dramaMovies = movies.filter(m => m.genre.toLowerCase().includes('drama'));
            return dramaMovies.length > 0 && (
              <EnhancedCarousel 
                title="🎭 Drama Collection" 
                subtitle="Powerful stories that move and inspire"
                items={dramaMovies.map(movie => ({
                  ...movie,
                  year: movie.year || "2024",
                  genre: movie.genre || "Drama",
                  imageUrl: movie.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleMovieClick}
              />
            );
          })()}
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