import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import NetflixMovieCard from "./NetflixMovieCard";

interface NetflixCarouselProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    year: string;
    rating: number;
    genre: string;
    imageUrl: string;
    duration?: string;
    description?: string;
  }>;
  onItemClick?: (item: any) => void;
}

const NetflixCarousel = ({ title, items, onItemClick }: NetflixCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemsPerView = 6;

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < items.length - itemsPerView;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(prev => Math.max(0, prev - itemsPerView));
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(prev => Math.min(items.length - itemsPerView, prev + itemsPerView));
    }
  };

  if (!items.length) return null;

  return (
    <div className="relative group mb-12">
      {/* Section Title */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 sm:px-6 lg:px-8">
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white h-12 w-12 rounded-full transition-all duration-200 ${
            canScrollLeft ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white h-12 w-12 rounded-full transition-all duration-200 ${
            canScrollRight ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={scrollRight}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Items Container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-hidden"
        >
          <div 
            className="flex transition-transform duration-500 ease-out gap-2"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {items.map((item, index) => (
              <div 
                key={item.id}
                className="flex-shrink-0"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="px-1">
                  <NetflixMovieCard
                    title={item.title}
                    year={item.year}
                    rating={item.rating}
                    genre={item.genre}
                    imageUrl={item.imageUrl}
                    duration={item.duration}
                    description={item.description}
                    onPlay={() => onItemClick?.(item)}
                    onAddToList={() => console.log('Add to list:', item.title)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Scroll Indicators */}
        <div className="flex justify-center mt-4 space-x-2 md:hidden">
          {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                Math.floor(currentIndex / itemsPerView) === index ? 'bg-white' : 'bg-white/30'
              }`}
              onClick={() => setCurrentIndex(index * itemsPerView)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetflixCarousel;