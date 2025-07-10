import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieCard from "./MovieCard";

interface Movie {
  id: string;
  title: string;
  year: string;
  rating: number;
  genre: string;
  imageUrl: string;
  duration?: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
}

const MovieSection = ({ title, movies }: MovieSectionProps) => {
  const scrollLeft = () => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              className="border-border/50 hover:bg-muted/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              className="border-border/50 hover:bg-muted/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Movies Scroll Container */}
        <div
          id={`scroll-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-48">
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSection;