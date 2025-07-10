import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import axios from "https://deno.land/x/axiod@0.26.2/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, category } = await req.json();
    const tmdbApiKey = Deno.env.get('TMDB_API_KEY');
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');

    let apiUrl = '';
    let headers: Record<string, string> = {};

    if (type === 'movies') {
      // TMDB Movies API
      apiUrl = `https://api.themoviedb.org/3/movie/${category}?api_key=${tmdbApiKey}&language=en-US&page=1`;
    } else if (type === 'tv') {
      // TMDB TV Shows API
      apiUrl = `https://api.themoviedb.org/3/tv/${category}?api_key=${tmdbApiKey}&language=en-US&page=1`;
    } else if (type === 'anime') {
      // Jikan API (MyAnimeList)
      apiUrl = `https://api.jikan.moe/v4/anime?order_by=score&sort=desc&limit=20`;
    } else if (type === 'imdb') {
      // IMDB API via RapidAPI
      const options = {
        method: 'GET',
        url: 'https://imdb8.p.rapidapi.com/actors/get-interesting-jobs',
        params: {
          nconst: category || 'nm0001667'
        },
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'imdb8.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        const transformedData = response.data?.map((item: any) => ({
          id: item.id || Math.random().toString(),
          title: item.title || 'Unknown Title',
          year: item.year || 'N/A',
          rating: item.rating || 0,
          genre: 'IMDB',
          imageUrl: item.image || '',
          duration: 'N/A',
          type: 'imdb'
        })) || [];

        return new Response(JSON.stringify({ results: transformedData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('IMDB API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    console.log('Fetching from:', apiUrl);

    const response = await fetch(apiUrl, { headers });
    const data = await response.json();

    // Transform data to consistent format
    let transformedData = [];

    if (type === 'anime') {
      transformedData = data.data?.map((item: any) => ({
        id: item.mal_id.toString(),
        title: item.title,
        year: item.aired?.from ? new Date(item.aired.from).getFullYear().toString() : 'N/A',
        rating: item.score || 0,
        genre: item.genres?.[0]?.name || 'Anime',
        imageUrl: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
        duration: item.duration || 'N/A',
        type: 'anime'
      })) || [];
    } else {
      transformedData = data.results?.map((item: any) => ({
        id: item.id.toString(),
        title: item.title || item.name,
        year: (item.release_date || item.first_air_date)?.substring(0, 4) || 'N/A',
        rating: Math.round(item.vote_average * 10) / 10,
        genre: type === 'movies' ? 'Movie' : 'TV Show',
        imageUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        duration: 'N/A',
        type: type
      })).filter((item: any) => item.imageUrl.includes('/')) || [];
    }

    return new Response(JSON.stringify({ results: transformedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});