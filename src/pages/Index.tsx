import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieSection from "@/components/MovieSection";

// Sample movie data - this would come from your backend/API
const sampleMovies = [
  {
    id: "1",
    title: "The Dark Knight",
    year: "2008",
    rating: 9.0,
    genre: "Action",
    imageUrl: "https://images.unsplash.com/photo-1489599904770-b5b0c3e5d5c3?w=400&h=600&fit=crop",
    duration: "2h 32m"
  },
  {
    id: "2", 
    title: "Inception",
    year: "2010",
    rating: 8.8,
    genre: "Sci-Fi",
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    duration: "2h 28m"
  },
  {
    id: "3",
    title: "Interstellar", 
    year: "2014",
    rating: 8.6,
    genre: "Sci-Fi",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    duration: "2h 49m"
  },
  {
    id: "4",
    title: "Pulp Fiction",
    year: "1994", 
    rating: 8.9,
    genre: "Crime",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    duration: "2h 34m"
  },
  {
    id: "5",
    title: "The Matrix",
    year: "1999",
    rating: 8.7,
    genre: "Sci-Fi", 
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    duration: "2h 16m"
  },
  {
    id: "6",
    title: "Fight Club",
    year: "1999",
    rating: 8.8,
    genre: "Drama",
    imageUrl: "https://images.unsplash.com/photo-1489599904770-b5b0c3e5d5c3?w=400&h=600&fit=crop",
    duration: "2h 19m"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      <div className="space-y-8 pb-16">
        <MovieSection title="Trending Now" movies={sampleMovies} />
        <MovieSection title="Popular Movies" movies={sampleMovies.slice(0, 4)} />
        <MovieSection title="New Releases" movies={sampleMovies.slice(1, 5)} />
        <MovieSection title="Action & Adventure" movies={sampleMovies.slice(2)} />
      </div>
    </div>
  );
};

export default Index;
