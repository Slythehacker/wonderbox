import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Movie } from '@/types/movie';

interface UseSearchReturn {
  searchResults: Movie[];
  isSearching: boolean;
  searchError: string | null;
  searchMovies: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Search movies
      const moviesResponse = await supabase.functions.invoke('fetch-movies', {
        body: { type: 'search', category: 'movie', query: query.trim() }
      });

      // Search TV shows
      const tvResponse = await supabase.functions.invoke('fetch-movies', {
        body: { type: 'search', category: 'tv', query: query.trim() }
      });

      const movieResults = moviesResponse.data?.results || [];
      const tvResults = tvResponse.data?.results || [];
      
      setSearchResults([...movieResults, ...tvResults]);
    } catch (err) {
      console.error('Search error:', err);
      setSearchError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchError(null);
  };

  return {
    searchResults,
    isSearching,
    searchError,
    searchMovies,
    clearSearch
  };
};