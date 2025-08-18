import { useState, useEffect } from 'react';
import { Search, X, Filter, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/hooks/useSearch';
import { Movie } from '@/types/movie';
import EnhancedMovieCard from './EnhancedMovieCard';

interface AdvancedSearchProps {
  onItemClick: (movie: Movie) => void;
}

export const AdvancedSearch = ({ onItemClick }: AdvancedSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const { searchResults, isSearching, searchMovies, clearSearch } = useSearch();

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller'];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchMovies(query);
        setIsOpen(true);
      } else {
        clearSearch();
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchMovies, clearSearch]);

  const toggleFilter = (genre: string) => {
    setFilters(prev => 
      prev.includes(genre) 
        ? prev.filter(f => f !== genre)
        : [...prev, genre]
    );
  };

  const filteredResults = searchResults.filter(movie => 
    filters.length === 0 || filters.some(filter => 
      movie.genre?.toLowerCase().includes(filter.toLowerCase())
    )
  );

  const clearAll = () => {
    setQuery('');
    setFilters([]);
    clearSearch();
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-primary" />
        <Input
          type="text"
          placeholder="Search movies, shows, anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-12 h-14 bg-card/80 backdrop-blur-sm border-border/50 rounded-2xl text-lg placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mt-4 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {genres.map(genre => (
          <Badge
            key={genre}
            variant={filters.includes(genre) ? "default" : "outline"}
            className="cursor-pointer hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20"
            onClick={() => toggleFilter(genre)}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {genre}
          </Badge>
        ))}
      </div>

      {/* Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-lg border border-border/50 rounded-2xl shadow-elegant max-h-96 overflow-y-auto z-50 animate-slide-up">
          {isSearching ? (
            <div className="p-6 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredResults.slice(0, 12).map((movie, index) => (
                <div
                  key={movie.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div 
                    className="relative bg-card rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      onItemClick(movie);
                      setIsOpen(false);
                    }}
                  >
                    <img 
                      src={movie.imageUrl || '/placeholder.svg'} 
                      alt={movie.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <h4 className="text-sm font-medium truncate">{movie.title}</h4>
                      <p className="text-xs text-muted-foreground">{movie.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};