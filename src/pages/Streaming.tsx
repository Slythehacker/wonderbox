import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NetflixVideoPlayer } from '@/components/NetflixVideoPlayer';
import { EpisodeSelector } from '@/components/EpisodeSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';
import { useMovieData } from '@/hooks/useMovieData';

export const Streaming: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { movies, tvShows, anime } = useMovieData();
  
  // Find the movie based on type and id
  const getContent = () => {
    switch (type) {
      case 'movie':
        return movies.find(m => m.id === id);
      case 'tv':
        return tvShows.find(m => m.id === id);
      case 'anime':
        return anime.find(m => m.id === id);
      default:
        return null;
    }
  };
  
  const content = getContent();
  
  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Content Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The content you're looking for could not be found.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const movieWithType = { ...content, type };
  
  const handlePlayClick = () => {
    setIsPlaying(true);
  };
  
  const handleClosePlayer = () => {
    setIsPlaying(false);
  };
  
  const handleEpisodeSelect = (season: number, episode: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {isPlaying && (
        <NetflixVideoPlayer
          movie={movieWithType}
          season={currentSeason}
          episode={currentEpisode}
          onClose={handleClosePlayer}
        />
      )}
      
      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img
                src={content.imageUrl}
                alt={content.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={handlePlayClick}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play className="mr-2 h-6 w-6" fill="currentColor" />
                  Play Now
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{content.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{content.year}</span>
                <span>•</span>
                <span>{content.genre}</span>
                <span>•</span>
                <span>⭐ {content.rating}</span>
                <span>•</span>
                <span>{content.duration}</span>
              </div>
            </div>
          </div>
          
          {/* Episode Selector for TV Shows and Anime */}
          {(type === 'tv' || type === 'anime') && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Episodes</CardTitle>
                </CardHeader>
                <CardContent>
                  <EpisodeSelector
                    seasons={type === 'anime' ? 1 : 3}
                    episodesPerSeason={type === 'anime' ? 24 : 10}
                    currentSeason={currentSeason}
                    currentEpisode={currentEpisode}
                    onEpisodeSelect={handleEpisodeSelect}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};