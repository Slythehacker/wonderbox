import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Movie {
  id: string;
  title: string;
  year: string;
  rating: number;
  genre: string;
  imageUrl: string;
  duration: string;
  type?: string;
}

interface UseMovieDataReturn {
  movies: Movie[];
  tvShows: Movie[];
  anime: Movie[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMovieData = (): UseMovieDataReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [anime, setAnime] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch movies
      const moviesResponse = await supabase.functions.invoke('fetch-movies', {
        body: { type: 'movies', category: 'popular' }
      });

      // Fetch TV shows
      const tvResponse = await supabase.functions.invoke('fetch-movies', {
        body: { type: 'tv', category: 'popular' }
      });

      // Fetch anime
      const animeResponse = await supabase.functions.invoke('fetch-movies', {
        body: { type: 'anime', category: 'top' }
      });

      if (moviesResponse.error) throw moviesResponse.error;
      if (tvResponse.error) throw tvResponse.error;
      if (animeResponse.error) throw animeResponse.error;

      setMovies(moviesResponse.data?.results || []);
      setTvShows(tvResponse.data?.results || []);
      setAnime(animeResponse.data?.results || []);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    movies,
    tvShows,
    anime,
    loading,
    error,
    refetch: fetchData
  };
};