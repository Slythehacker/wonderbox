import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import EnhancedCarousel from '@/components/EnhancedCarousel';
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
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 py-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              🎌 Anime
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Enter the vibrant world of anime with our curated collection. 
              From epic adventures to heartwarming stories, discover the magic of Japanese animation.
            </p>
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{topAnime.length + popularAnime.length}+</div>
                <div className="text-sm text-muted-foreground">Anime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">SUB</div>
                <div className="text-sm text-muted-foreground">& DUB</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">全て</div>
                <div className="text-sm text-muted-foreground">All Genres</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pb-20">
        <div className="space-y-16">
          {topAnime.length > 0 && (
            <EnhancedCarousel 
              title="👑 Top Anime" 
              subtitle="The highest-rated anime series and movies"
              featured={true}
              cardSize="lg"
              items={topAnime.map(anime => ({
                ...anime,
                year: anime.year || "2024",
                genre: anime.genre || "Anime",
                imageUrl: anime.imageUrl || "/placeholder.svg",
              }))}
              onItemClick={handleAnimeClick}
            />
          )}
          
          {popularAnime.length > 0 && (
            <EnhancedCarousel 
              title="🔥 Popular Anime" 
              subtitle="Trending anime that everyone's watching"
              items={popularAnime.map(anime => ({
                ...anime,
                year: anime.year || "2024",
                genre: anime.genre || "Anime",
                imageUrl: anime.imageUrl || "/placeholder.svg",
              }))}
              onItemClick={handleAnimeClick}
            />
          )}

          {/* Genre Collections */}
          {(() => {
            const actionAnime = popularAnime.filter(m => m.genre.toLowerCase().includes('action'));
            return actionAnime.length > 0 && (
              <EnhancedCarousel 
                title="⚔️ Action Anime" 
                subtitle="Epic battles and high-energy adventures"
                items={actionAnime.map(anime => ({
                  ...anime,
                  year: anime.year || "2024",
                  genre: anime.genre || "Action",
                  imageUrl: anime.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleAnimeClick}
              />
            );
          })()}

          {(() => {
            const romanceAnime = topAnime.filter(m => m.genre.toLowerCase().includes('romance'));
            return romanceAnime.length > 0 && (
              <EnhancedCarousel 
                title="💝 Romance Anime" 
                subtitle="Heartwarming love stories and relationships"
                items={romanceAnime.map(anime => ({
                  ...anime,
                  year: anime.year || "2024",
                  genre: anime.genre || "Romance",
                  imageUrl: anime.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleAnimeClick}
              />
            );
          })()}

          {(() => {
            const comedyAnime = popularAnime.filter(m => m.genre.toLowerCase().includes('comedy'));
            return comedyAnime.length > 0 && (
              <EnhancedCarousel 
                title="😄 Comedy Anime" 
                subtitle="Hilarious series that will make you laugh"
                items={comedyAnime.map(anime => ({
                  ...anime,
                  year: anime.year || "2024",
                  genre: anime.genre || "Comedy",
                  imageUrl: anime.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleAnimeClick}
              />
            );
          })()}

          {(() => {
            const supernaturalAnime = topAnime.filter(m => m.genre.toLowerCase().includes('supernatural') || m.genre.toLowerCase().includes('fantasy'));
            return supernaturalAnime.length > 0 && (
              <EnhancedCarousel 
                title="🌟 Supernatural Anime" 
                subtitle="Mystical powers and fantastical worlds"
                items={supernaturalAnime.map(anime => ({
                  ...anime,
                  year: anime.year || "2024",
                  genre: anime.genre || "Supernatural",
                  imageUrl: anime.imageUrl || "/placeholder.svg",
                }))}
                onItemClick={handleAnimeClick}
              />
            );
          })()}
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