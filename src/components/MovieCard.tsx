import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Plus, Heart, Star } from "lucide-react";

interface MovieCardProps {
  title: string;
  year: string;
  rating: number;
  genre: string;
  imageUrl: string;
  duration?: string;
}

const MovieCard = ({ title, year, rating, genre, imageUrl, duration }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-card rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-3">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Play className="h-4 w-4 mr-1" />
                Play
              </Button>
              <Button size="sm" variant="outline" className="border-white/20">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-white/20">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-xs font-medium text-white">{rating}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{title}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{year}</span>
          {duration && <span>{duration}</span>}
        </div>
        <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
          {genre}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;