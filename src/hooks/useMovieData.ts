import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Movie } from '@/types/movie';

interface UseMovieDataReturn {
  movies: Movie[];
  tvShows: Movie[];
  anime: Movie[];
  trendingMovies: Movie[];
  topRatedMovies: Movie[];
  upcomingMovies: Movie[];
  popularTvShows: Movie[];
  topRatedTvShows: Movie[];
  airingTodayTvShows: Movie[];
  popularAnime: Movie[];
  topAnime: Movie[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMovieData = (): UseMovieDataReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [anime, setAnime] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [popularTvShows, setPopularTvShows] = useState<Movie[]>([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState<Movie[]>([]);
  const [airingTodayTvShows, setAiringTodayTvShows] = useState<Movie[]>([]);
  const [popularAnime, setPopularAnime] = useState<Movie[]>([]);
  const [topAnime, setTopAnime] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch multiple movie categories
      const [
        moviesResponse,
        trendingResponse,
        topRatedResponse,
        upcomingResponse,
        tvResponse,
        topRatedTvResponse,
        airingTodayResponse,
        animeResponse,
        popularAnimeResponse
      ] = await Promise.all([
        supabase.functions.invoke('fetch-movies', { body: { type: 'movies', category: 'popular' } }),
        supabase.functions.invoke('fetch-movies', { body: { type: 'movies', category: 'now_playing' } }),
        supabase.functions.invoke('fetch-movies', { body: { type: 'movies', category: 'top_rated' } }),
        supabase.functions.invoke('fetch-movies', { body: { type: 'movies', category: 'upcoming' } }),
        supabase.functions.invoke('fetch-movies', { body: { type: 'tv', category: 'popular' } }),
        supabase.functions.invoke('fetch-movies', { body: { type: 'tv', category: 'top_rated' } }),
        supabase.functions.invoke('fetch-movies', { body: { type: 'tv', category: 'airing_today' } }),
        supabase.functions.invoke('fetch-movies', { body: { type: 'anime', category: 'top' } }),
        supabase.functions.invoke('fetch-movies', { body: { type: 'anime', category: 'popular' } })
      ]);

      // Set all the data
      setMovies(moviesResponse.data?.results || []);
      setTrendingMovies(trendingResponse.data?.results || []);
      setTopRatedMovies(topRatedResponse.data?.results || []);
      setUpcomingMovies(upcomingResponse.data?.results || []);
      setTvShows(tvResponse.data?.results || []);
      setPopularTvShows(tvResponse.data?.results || []);
      setTopRatedTvShows(topRatedTvResponse.data?.results || []);
      setAiringTodayTvShows(airingTodayResponse.data?.results || []);
      setAnime(animeResponse.data?.results || []);
      setPopularAnime(popularAnimeResponse.data?.results || []);
      setTopAnime(animeResponse.data?.results || []);

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
    trendingMovies,
    topRatedMovies,
    upcomingMovies,
    popularTvShows,
    topRatedTvShows,
    airingTodayTvShows,
    popularAnime,
    topAnime,
    loading,
    error,
    refetch: fetchData
  };
};