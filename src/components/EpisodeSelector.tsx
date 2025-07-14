import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface EpisodeSelectorProps {
  seasons: number;
  episodesPerSeason: number;
  currentSeason: number;
  currentEpisode: number;
  onEpisodeSelect: (season: number, episode: number) => void;
}

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  seasons,
  episodesPerSeason,
  currentSeason,
  currentEpisode,
  onEpisodeSelect,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Episodes</h3>
      
      <ScrollArea className="h-64 w-full rounded-md border">
        <div className="p-4 space-y-4">
          {Array.from({ length: seasons }, (_, seasonIndex) => {
            const seasonNumber = seasonIndex + 1;
            return (
              <div key={seasonNumber} className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Season {seasonNumber}
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: episodesPerSeason }, (_, episodeIndex) => {
                    const episodeNumber = episodeIndex + 1;
                    const isActive = currentSeason === seasonNumber && currentEpisode === episodeNumber;
                    
                    return (
                      <Button
                        key={episodeNumber}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => onEpisodeSelect(seasonNumber, episodeNumber)}
                        className="h-8"
                      >
                        {episodeNumber}
                      </Button>
                    );
                  })}
                </div>
                {seasonNumber < seasons && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};