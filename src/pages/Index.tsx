import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieSection from "@/components/MovieSection";
import { useMovieData } from "@/hooks/useMovieData";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { movies, tvShows, anime, loading, error } = useMovieData();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      <div className="space-y-8 pb-16">
        <MovieSection title="Trending Movies" movies={movies} />
        <MovieSection title="Popular TV Shows" movies={tvShows} />
        <MovieSection title="Top Anime" movies={anime} />
        <MovieSection title="Mixed Content" movies={[...movies.slice(0, 3), ...tvShows.slice(0, 3), ...anime.slice(0, 3)]} />
      </div>
    </div>
  );
};

export default Index;
