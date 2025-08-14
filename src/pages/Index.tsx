import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import NetflixHero from "@/components/NetflixHero";
import EnhancedCarousel from "@/components/EnhancedCarousel";
import TopTenRow from "@/components/TopTenRow";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
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

  // SEO: set page title
  useEffect(() => {
    document.title = "Wonderbox – Stream Movies, TV Shows & Anime";
  }, []);

  // Structured data for Top items
  useEffect(() => {
    if (!movies?.length) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const top = movies.slice(0, 5).map((m, i) => ({
      '@type': 'Movie',
      name: m.title,
      datePublished: m.year,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: m.rating,
        bestRating: '10',
        ratingCount: 1000 + (i * 137)
      },
      genre: m.genre
    }));
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Top 5 on Wonderbox',
      itemListElement: top.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item
      }))
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [movies]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        {/* Hero skeleton */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          <Skeleton className="absolute inset-0 rounded-none" />
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4 max-w-2xl">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-5 w-[32rem]" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-36" />
              </div>
            </div>
          </div>
        </section>

        {/* Rows skeleton */}
        <div className="space-y-8 -mt-24 relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
          {Array.from({ length: 3 }).map((_, rowIdx) => (
            <div key={rowIdx}>
              <Skeleton className="h-6 w-48 mb-3" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <Footer />
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
      <NetflixHero 
        onPlayClick={() => movies.length > 0 && handleStreamClick(movies[0])}
        onInfoClick={() => console.log('More info clicked')}
      />
      
      <div className="space-y-12 -mt-32 relative z-10 pb-20">
        {/* Top 10 Section */}
        <TopTenRow
          title="🔥 Top 10 in Your Country Today"
          items={movies}
          onItemClick={handleStreamClick}
        />

        <EnhancedCarousel 
          title="Trending Now" 
          subtitle="What everyone's watching right now"
          featured={true}
          cardSize="lg"
          items={movies.slice(0, 12).map(movie => ({
            ...movie,
            year: movie.year || "2024",
            genre: movie.genre || "Action",
            imageUrl: movie.imageUrl || "/placeholder.svg",
          }))}
          onItemClick={handleStreamClick}
        />

        <EnhancedCarousel 
          title="Popular TV Shows" 
          subtitle="Binge-worthy series you can't stop watching"
          items={tvShows.map(show => ({
            ...show,
            year: show.year || "2024",
            genre: show.genre || "Drama",
            imageUrl: show.imageUrl || "/placeholder.svg",
          }))}
          onItemClick={handleStreamClick}
        />

        <EnhancedCarousel 
          title="Anime Collection" 
          subtitle="Epic adventures from Japan and beyond"
          items={anime.map(item => ({
            ...item,
            year: item.year || "2024",
            genre: item.genre || "Anime",
            imageUrl: item.imageUrl || "/placeholder.svg",
          }))}
          onItemClick={handleStreamClick}
        />

        <EnhancedCarousel 
          title="Because You Watched..." 
          subtitle="Personalized picks just for you"
          cardSize="sm"
          items={[...movies.slice(0, 8), ...tvShows.slice(0, 8)].map(item => ({
            ...item,
            year: item.year || "2024",
            genre: item.genre || "Mixed",
            imageUrl: item.imageUrl || "/placeholder.svg",
          }))}
          onItemClick={handleStreamClick}
        />

        {/* Genre Collections */}
        {movies.filter(m => m.genre.toLowerCase().includes('action')).length > 0 && (
          <EnhancedCarousel 
            title="Action & Adventure" 
            subtitle="Heart-pounding thrills and excitement"
            items={movies.filter(m => m.genre.toLowerCase().includes('action')).map(movie => ({
              ...movie,
              year: movie.year || "2024",
              genre: movie.genre || "Action",
              imageUrl: movie.imageUrl || "/placeholder.svg",
            }))}
            onItemClick={handleStreamClick}
          />
        )}

        {movies.filter(m => m.genre.toLowerCase().includes('comedy')).length > 0 && (
          <EnhancedCarousel 
            title="Comedy Central" 
            subtitle="Laugh out loud with these hilarious picks"
            items={movies.filter(m => m.genre.toLowerCase().includes('comedy')).map(movie => ({
              ...movie,
              year: movie.year || "2024",
              genre: movie.genre || "Comedy",
              imageUrl: movie.imageUrl || "/placeholder.svg",
            }))}
            onItemClick={handleStreamClick}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
