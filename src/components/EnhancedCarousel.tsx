import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnhancedMovieCard from "./EnhancedMovieCard";

interface EnhancedCarouselProps {
  title: string;
  subtitle?: string;
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
  featured?: boolean;
  cardSize?: 'sm' | 'md' | 'lg';
}

const EnhancedCarousel = ({ 
  title, 
  subtitle, 
  items, 
  onItemClick, 
  featured = false,
  cardSize = 'md'
}: EnhancedCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const itemsPerView = cardSize === 'lg' ? 4 : cardSize === 'md' ? 6 : 8;
  
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < items.length - itemsPerView;

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    <section 
      ref={carouselRef}
      className={`
        relative mb-16 group
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${featured ? 'mb-20' : ''}
      `}
    >
      {/* Section Header */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              {featured && <Sparkles className="h-5 w-5 text-primary animate-pulse" />}
              <h2 className={`
                font-bold text-foreground
                ${featured ? 'text-2xl md:text-3xl bg-gradient-primary bg-clip-text text-transparent' : 'text-xl md:text-2xl'}
              `}>
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>
            )}
          </div>
          
          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className={`
                border-border/50 hover:border-primary/50 h-10 w-10
                transition-all duration-200
                ${canScrollLeft ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}
              `}
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className={`
                border-border/50 hover:border-primary/50 h-10 w-10
                transition-all duration-200
                ${canScrollRight ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}
              `}
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-border/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500 ease-out"
            style={{ 
              width: `${((currentIndex + itemsPerView) / items.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        
        {/* Floating Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className={`
            absolute left-2 top-1/2 -translate-y-1/2 z-20
            bg-black/80 hover:bg-black/90 text-white h-12 w-12 rounded-full
            backdrop-blur-sm border border-white/20
            transition-all duration-300 ease-out
            ${canScrollLeft ? 'opacity-0 group-hover:opacity-100 translate-x-0' : 'opacity-0 pointer-events-none -translate-x-4'}
          `}
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`
            absolute right-2 top-1/2 -translate-y-1/2 z-20
            bg-black/80 hover:bg-black/90 text-white h-12 w-12 rounded-full
            backdrop-blur-sm border border-white/20
            transition-all duration-300 ease-out
            ${canScrollRight ? 'opacity-0 group-hover:opacity-100 translate-x-0' : 'opacity-0 pointer-events-none translate-x-4'}
          `}
          onClick={scrollRight}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Items Container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-hidden"
        >
          <div 
            className="flex transition-transform duration-500 ease-out gap-3"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {items.map((item, index) => (
              <div 
                key={item.id}
                className="flex-shrink-0 transition-all duration-300"
                style={{ 
                  width: `${100 / itemsPerView}%`,
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="px-1.5">
                  <EnhancedMovieCard
                    title={item.title}
                    year={item.year}
                    rating={item.rating}
                    genre={item.genre}
                    imageUrl={item.imageUrl}
                    duration={item.duration}
                    description={item.description}
                    size={cardSize}
                    onPlay={() => onItemClick?.(item)}
                    onAddToList={() => console.log('Add to list:', item.title)}
                    onInfo={() => console.log('More info:', item.title)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Scroll Indicators */}
        <div className="flex justify-center mt-6 space-x-2 md:hidden">
          {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${Math.floor(currentIndex / itemsPerView) === index 
                  ? 'bg-primary scale-125' 
                  : 'bg-border hover:bg-border/80'
                }
              `}
              onClick={() => setCurrentIndex(index * itemsPerView)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedCarousel;