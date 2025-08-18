import { useState } from "react";
import NetflixMovieCard from "./NetflixMovieCard";
import { Movie } from "@/types/movie";
import { ChevronLeft, ChevronRight, Trophy, TrendingUp } from "lucide-react";

interface TopTenRowProps {
  title?: string;
  items: Movie[];
  onItemClick?: (item: Movie) => void;
}

const TopTenRow = ({ title = "Top 10 Today", items, onItemClick }: TopTenRowProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  if (!items?.length) return null;

  const top10 = items.slice(0, 10);

  const getRankBadgeColor = (index: number) => {
    if (index === 0) return "from-yellow-400 to-yellow-600"; // Gold
    if (index === 1) return "from-gray-300 to-gray-500"; // Silver
    if (index === 2) return "from-amber-600 to-amber-800"; // Bronze
    return "from-slate-600 to-slate-800"; // Default
  };

  const getRankIcon = (index: number) => {
    if (index < 3) return <Trophy className="w-3 h-3 md:w-4 md:h-4" />;
    return <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />;
  };

  return (
    <section className="relative mb-16">
      {/* Enhanced Header */}
      <div className="flex items-center gap-4 mb-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-foreground text-2xl md:text-3xl font-bold">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm">
              Most watched content right now
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="relative group">
        <div className="px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 md:gap-6 pb-4">
            {top10.map((item, index) => (
              <div 
                key={item.id} 
                className="relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px] lg:w-[220px]"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Enhanced Rank Badge */}
                <div className="absolute -top-2 -left-2 z-20">
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded-lg text-white font-bold text-xs
                    bg-gradient-to-r ${getRankBadgeColor(index)}
                    shadow-lg border-2 border-white/20
                    transform transition-all duration-300
                    ${hoveredIndex === index ? 'scale-110 shadow-xl' : ''}
                  `}>
                    {getRankIcon(index)}
                    <span>#{index + 1}</span>
                  </div>
                </div>

                {/* Animated Background Number */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <span className={`
                    text-[80px] sm:text-[100px] md:text-[140px] lg:text-[160px] 
                    font-black leading-none select-none
                    bg-gradient-to-b from-white/5 via-white/10 to-transparent
                    bg-clip-text text-transparent
                    transform transition-all duration-500
                    ${hoveredIndex === index ? 'scale-110 opacity-20' : 'opacity-5'}
                  `}>
                    {index + 1}
                  </span>
                </div>

                {/* Movie Card Container */}
                <div className={`
                  relative transform transition-all duration-300 ease-out
                  ${hoveredIndex === index ? 
                    'scale-105 translate-y-[-8px] z-10' : 
                    'hover:scale-102'
                  }
                `}>
                  <div className={`
                    rounded-xl overflow-hidden
                    ${hoveredIndex === index ? 
                      'shadow-2xl shadow-primary/25 ring-2 ring-primary/30' : 
                      'shadow-lg shadow-black/20'
                    }
                  `}>
                    <NetflixMovieCard
                      title={item.title}
                      year={item.year}
                      rating={item.rating}
                      genre={item.genre}
                      imageUrl={item.imageUrl}
                      duration={item.duration}
                      onPlay={() => onItemClick?.(item)}
                      onAddToList={() => console.log("Add to list:", item.title)}
                    />
                  </div>
                </div>

                {/* Rank Change Indicator */}
                {index < 5 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/90 text-white text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{Math.floor(Math.random() * 5) + 1}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Overlays for Scroll Indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <button className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
          <span className="font-medium">View Complete Rankings</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default TopTenRow;
