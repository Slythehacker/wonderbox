import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NetflixHero from "@/components/NetflixHero";
import NetflixCarousel from "@/components/NetflixCarousel";
import Footer from "@/components/Footer";
import { useMovieData } from "@/hooks/useMovieData";
import { useAuth } from "@/hooks/useAuth";
import { Movie } from "@/types/movie";

const Index = () => {
  const { movies, tvShows, anime, loading, error } = useMovieData();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleStreamClick = (movie: Movie) => {
    // Determine content type based on the section
    let contentType = 'movie';
    if (tvShows.includes(movie)) contentType = 'tv';
    if (anime.includes(movie)) contentType = 'anime';
    
    navigate(`/streaming/${contentType}/${movie.id}`);
  };

  useEffect(() => {
    // Redirect authenticated users who land on auth page back to home
    if (user && window.location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading content: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <NetflixHero 
        onPlayClick={() => movies.length > 0 && handleStreamClick(movies[0])}
        onInfoClick={() => console.log('More info clicked')}
      />
      
      <div className="space-y-8 -mt-32 relative z-10">
        <NetflixCarousel 
          title="Trending Now" 
          items={movies.map(movie => ({
            ...movie,
            year: movie.year || "2024",
            genre: movie.genre || "Action",
            imageUrl: movie.imageUrl || "/placeholder.svg",
          }))}
          onItemClick={handleStreamClick}
        />
        <NetflixCarousel 
          title="Popular TV Shows" 
          items={tvShows.map(show => ({
            ...show,
            year: show.year || "2024",
            genre: show.genre || "Drama",
            imageUrl: show.imageUrl || "/placeholder.svg",
          }))}
          onItemClick={handleStreamClick}
        />
        <NetflixCarousel 
          title="Anime Collection" 
          items={anime.map(item => ({
            ...item,
            year: item.year || "2024",
            genre: item.genre || "Anime",
            imageUrl: item.imageUrl || "/placeholder.svg",
          }))}
          onItemClick={handleStreamClick}
        />
        <NetflixCarousel 
          title="Because you watched..." 
          items={[...movies.slice(0, 8), ...tvShows.slice(0, 8)].map(item => ({
            ...item,
            year: item.year || "2024",
            genre: item.genre || "Mixed",
            imageUrl: item.imageUrl || "/placeholder.svg",
          }))}
          onItemClick={handleStreamClick}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
