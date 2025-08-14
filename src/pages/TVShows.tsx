import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import EnhancedCarousel from '@/components/EnhancedCarousel';
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
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 py-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              📺 TV Shows
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dive into captivating stories with our extensive collection of TV series. 
              From thrilling dramas to laugh-out-loud comedies, binge your way to entertainment bliss.
            </p>
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{popularTvShows.length}+</div>
                <div className="text-sm text-muted-foreground">Series</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">HD</div>
                <div className="text-sm text-muted-foreground">Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Episodes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pb-20">
        <div className="space-y-16">
          {popularTvShows.length > 0 && (
            <EnhancedCarousel 
              title="📈 Popular TV Shows" 
              subtitle="The most-watched series everyone's talking about"
              featured={true}
              cardSize="lg"
              items={popularTvShows.map(show => ({
                ...show,
                year: show.year || "2024",
                genre: show.genre || "Drama",
                imageUrl: show.imageUrl || "/placeholder.svg",
              }))}
              onItemClick={handleTVShowClick}
            />
          )}
          
          {topRatedTvShows.length > 0 && (
            <EnhancedCarousel 
              title="⭐ Top Rated TV Shows" 
              subtitle="Critically acclaimed series that define excellence"
              items={topRatedTvShows.map(show => ({
                ...show,
                year: show.year || "2024",
                genre: show.genre || "Drama",
                imageUrl: show.imageUrl || "/placeholder.svg",
              }))}
              onItemClick={handleTVShowClick}
            />
          )}
          
          {airingTodayTvShows.length > 0 && (
            <EnhancedCarousel 
              title="📺 Airing Today" 
              subtitle="Fresh episodes dropping today"
              items={airingTodayTvShows.map(show => ({
                ...show,
                year: show.year || "2024",
                genre: show.genre || "Drama",
                imageUrl: show.imageUrl || "/placeholder.svg",
              }))}
              onItemClick={handleTVShowClick}
            />
          )}

          {/* Genre Collections */}
          {(() => {
            const crimeShows = popularTvShows.filter(m => m.genre.toLowerCase().includes('crime') || m.genre.toLowerCase().includes('thriller'));
            return crimeShows.length > 0 && (
              <EnhancedCarousel 
                title="🕵️ Crime & Thriller Shows" 
                subtitle="Edge-of-your-seat mysteries and suspense"
                items={crimeShows.map(show => ({
                  ...show,
                  year: show.year || "2024",
                  genre: show.genre || "Crime",
                  imageUrl: show.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleTVShowClick}
              />
            );
          })()}

          {(() => {
            const comedyShows = popularTvShows.filter(m => m.genre.toLowerCase().includes('comedy'));
            return comedyShows.length > 0 && (
              <EnhancedCarousel 
                title="😂 Comedy Series" 
                subtitle="Hilarious shows to brighten your day"
                items={comedyShows.map(show => ({
                  ...show,
                  year: show.year || "2024",
                  genre: show.genre || "Comedy",
                  imageUrl: show.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleTVShowClick}
              />
            );
          })()}

          {(() => {
            const scifiShows = popularTvShows.filter(m => m.genre.toLowerCase().includes('sci-fi') || m.genre.toLowerCase().includes('fantasy'));
            return scifiShows.length > 0 && (
              <EnhancedCarousel 
                title="🚀 Sci-Fi & Fantasy" 
                subtitle="Explore otherworldly adventures and magic"
                items={scifiShows.map(show => ({
                  ...show,
                  year: show.year || "2024",
                  genre: show.genre || "Sci-Fi",
                  imageUrl: show.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleTVShowClick}
              />
            );
          })()}

          {(() => {
            const docShows = topRatedTvShows.filter(m => m.genre.toLowerCase().includes('documentary'));
            return docShows.length > 0 && (
              <EnhancedCarousel 
                title="📚 Documentary Series" 
                subtitle="Real stories that educate and inspire"
                items={docShows.map(show => ({
                  ...show,
                  year: show.year || "2024",
                  genre: show.genre || "Documentary",
                  imageUrl: show.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleTVShowClick}
              />
            );
          })()}
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