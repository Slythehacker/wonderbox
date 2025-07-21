import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Plus, ChevronDown, ThumbsUp, ThumbsDown, Info } from "lucide-react";

interface NetflixMovieCardProps {
  title: string;
  year: string;
  rating: number;
  genre: string;
  imageUrl: string;
  duration?: string;
  description?: string;
  onPlay?: () => void;
  onAddToList?: () => void;
}

const NetflixMovieCard = ({ 
  title, 
  year, 
  rating, 
  genre, 
  imageUrl, 
  duration,
  description,
  onPlay,
  onAddToList
}: NetflixMovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="group relative cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsExpanded(false);
      }}
    >
      {/* Main Card */}
      <div className={`relative bg-background rounded-lg overflow-hidden transform transition-all duration-300 ${
        isHovered ? 'scale-110 z-10 shadow-2xl' : 'scale-100'
      }`}>
        
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />

          {/* Play Button Overlay */}
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="icon"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 h-16 w-16 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
                onClick={onPlay}
              >
                <Play className="h-6 w-6 text-white ml-1" />
              </Button>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-white text-sm font-bold">{rating}</span>
          </div>

          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm rounded px-2 py-1">
              <span className="text-white text-xs">{duration}</span>
            </div>
          )}
        </div>

        {/* Netflix-style Bottom Section */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4">
            
            {/* Action Buttons Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  className="bg-white text-black hover:bg-white/90 h-8 w-8 rounded-full"
                  onClick={onPlay}
                >
                  <Play className="h-4 w-4 ml-0.5" />
                </Button>
                
                <Button
                  size="icon"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/20 h-8 w-8 rounded-full"
                  onClick={onAddToList}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/20 h-8 w-8 rounded-full"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                
                <Button
                  size="icon"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/20 h-8 w-8 rounded-full"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                size="icon"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/20 h-8 w-8 rounded-full"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Title and Basic Info */}
            <div className="space-y-1">
              <h3 className="text-white font-bold text-sm line-clamp-1">{title}</h3>
              <div className="flex items-center space-x-2 text-xs text-white/80">
                <span className="text-green-400 font-semibold">{Math.round(rating * 10)}% Match</span>
                <span>{year}</span>
                <span className="px-1 py-0.5 border border-white/40 text-xs">{rating >= 8 ? 'HD' : 'SD'}</span>
              </div>
              <div className="text-white/60 text-xs">{genre}</div>
            </div>

            {/* Expanded Info */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-white/20 space-y-2 animate-fade-in">
                <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
                  {description || `${title} delivers an exceptional viewing experience with stunning visuals and compelling storytelling that will keep you engaged from start to finish.`}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Cast & Crew</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white h-6 px-2"
                  >
                    <Info className="h-3 w-3 mr-1" />
                    More Info
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Simple Card (when not hovered) */}
      {!isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-1">{title}</h3>
          <div className="text-white/70 text-xs mt-1">{year} • {genre}</div>
        </div>
      )}
    </div>
  );
};

export default NetflixMovieCard;