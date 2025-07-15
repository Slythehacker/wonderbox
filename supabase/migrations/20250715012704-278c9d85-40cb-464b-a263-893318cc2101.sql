-- Update the check constraint to allow both 'movie' and 'movies', 'tv' and 'tv_show' for flexibility
ALTER TABLE public.watchlist DROP CONSTRAINT watchlist_movie_type_check;

ALTER TABLE public.watchlist ADD CONSTRAINT watchlist_movie_type_check 
CHECK (movie_type = ANY (ARRAY['movie'::text, 'movies'::text, 'tv'::text, 'tv_show'::text, 'anime'::text, 'imdb'::text]));