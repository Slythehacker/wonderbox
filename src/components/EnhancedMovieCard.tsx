import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Plus, Heart, Info, Star, Clock } from "lucide-react";

interface EnhancedMovieCardProps {
  title: string;
  year: string;
  rating: number;
  genre: string;
  imageUrl: string;
  duration?: string;
  description?: string;
  isWatchlisted?: boolean;
  onPlay?: () => void;
  onAddToList?: () => void;
  onInfo?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const EnhancedMovieCard = ({ 
  title, 
  year, 
  rating, 
  genre, 
  imageUrl, 
  duration,
  description,
  isWatchlisted = false,
  onPlay,
  onAddToList,
  onInfo,
  size = 'md',
  showDetails = true
}: EnhancedMovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'aspect-[2/3] min-h-[240px]',
    md: 'aspect-[2/3] min-h-[300px]',
    lg: 'aspect-[2/3] min-h-[360px]'
  };

  const getQualityBadge = () => {
    if (rating >= 8.5) return { label: '4K', color: 'bg-emerald-500' };
    if (rating >= 7.5) return { label: 'HD', color: 'bg-blue-500' };
    return { label: 'SD', color: 'bg-muted' };
  };

  const qualityBadge = getQualityBadge();

  return (
    <div 
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card Container */}
      <div className={`
        relative overflow-hidden rounded-xl bg-gradient-card border border-border/50
        transition-all duration-500 ease-out
        ${isHovered ? 'scale-105 shadow-elegant border-primary/30' : 'shadow-soft'}
        ${sizeClasses[size]}
      `}>
        
        {/* Background Image */}
        <div className="absolute inset-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-accent animate-pulse" />
          )}
          <img
            src={imageUrl}
            alt={title}
            className={`
              w-full h-full object-cover transition-all duration-700 ease-out
              ${isHovered ? 'scale-110' : 'scale-100'}
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className={`
            absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-60'}
          `} />
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {/* Quality Badge */}
          <div className={`
            px-2 py-1 rounded-md text-xs font-bold text-white
            ${qualityBadge.color}
            transition-all duration-300
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'}
          `}>
            {qualityBadge.label}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Duration Badge */}
        {duration && (
          <div className="absolute top-3 right-3 left-3 flex justify-center">
            <div className={`
              flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1
              transition-all duration-300
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
            `}>
              <Clock className="h-3 w-3 text-white" />
              <span className="text-white text-xs">{duration}</span>
            </div>
          </div>
        )}

        {/* Center Play Button */}
        <div className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-300
          ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
        `}>
          <Button
            size="icon"
            className="bg-white/90 hover:bg-white text-black h-14 w-14 rounded-full shadow-glow"
            onClick={onPlay}
          >
            <Play className="h-6 w-6 ml-1 fill-current" />
          </Button>
        </div>

        {/* Bottom Info Panel */}
        <div className={`
          absolute bottom-0 left-0 right-0 p-4
          transition-all duration-300 ease-out
          ${isHovered && showDetails ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}>
          <div className="bg-black/90 backdrop-blur-md rounded-lg p-4 border border-white/10">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-white/90 h-8 px-3"
                  onClick={onPlay}
                >
                  <Play className="h-3 w-3 mr-1 fill-current" />
                  Play
                </Button>
                
                <Button
                  size="icon"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/20 h-8 w-8"
                  onClick={onAddToList}
                >
                  <Plus className={`h-3 w-3 ${isWatchlisted ? 'text-primary' : ''}`} />
                </Button>
                
                <Button
                  size="icon"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/20 h-8 w-8"
                >
                  <Heart className={`h-3 w-3 ${isWatchlisted ? 'fill-current text-red-500' : ''}`} />
                </Button>
              </div>
              
              <Button
                size="icon"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20 h-8 w-8"
                onClick={onInfo}
              >
                <Info className="h-3 w-3" />
              </Button>
            </div>

            {/* Title and Info */}
            <div className="space-y-2">
              <h3 className="text-white font-bold text-sm line-clamp-1">{title}</h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-green-400 font-semibold">{Math.round(rating * 10)}% Match</span>
                <span className="text-white/80">{year}</span>
                <span className="text-white/60">•</span>
                <span className="text-white/60">{genre}</span>
              </div>
              
              {description && (
                <p className="text-white/70 text-xs line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Simple Overlay (when not hovered) */}
        {!isHovered && showDetails && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">{title}</h3>
            <div className="flex items-center space-x-2 text-xs text-white/70">
              <span>{year}</span>
              <span>•</span>
              <span>{genre}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMovieCard;