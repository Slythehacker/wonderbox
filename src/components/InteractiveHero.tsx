import { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Movie } from '@/types/movie';

interface InteractiveHeroProps {
  movie?: Movie;
  onPlayClick: () => void;
  onInfoClick: () => void;
}

export const InteractiveHero = ({ movie, onPlayClick, onInfoClick }: InteractiveHeroProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Featured movies for slideshow
  const featuredMovies = [
    {
      id: 1,
      title: "Cyberpunk 2099",
      description: "In a dystopian future where technology and humanity collide, a hacker discovers a conspiracy that threatens to destroy everything.",
      genre: "Sci-Fi",
      year: "2024",
      rating: 9.2,
      duration: "2h 15m",
      imageUrl: "/placeholder.svg",
      backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1920&q=80"
    },
    {
      id: 2,
      title: "Ocean's Legends",
      description: "The greatest heist crew ever assembled reunites for one final job that will test their limits and loyalty.",
      genre: "Action",
      year: "2024", 
      rating: 8.8,
      duration: "2h 32m",
      imageUrl: "/placeholder.svg",
      backdropUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80"
    },
    {
      id: 3,
      title: "Mystic Realms",
      description: "A young mage discovers ancient powers that could save or destroy the magical world she's sworn to protect.",
      genre: "Fantasy",
      year: "2024",
      rating: 9.5,
      duration: "1h 58m", 
      imageUrl: "/placeholder.svg",
      backdropUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1920&q=80"
    }
  ];

  const currentMovie = movie || featuredMovies[currentSlide];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video/Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentMovie.backdropUrl || currentMovie.imageUrl})`
        }}
      >
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl space-y-6 animate-fade-in">
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {currentMovie.genre}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              {currentMovie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{currentMovie.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{currentMovie.duration}</span>
              </div>
              <span className="px-2 py-1 bg-white/20 rounded text-sm font-medium">
                {currentMovie.year}
              </span>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl">
              {currentMovie.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={onPlayClick}
                className="bg-white text-black hover:bg-white/90 transition-all duration-300 text-lg px-8 py-6 rounded-xl font-semibold shadow-elegant hover:scale-105 hover:shadow-glow group"
              >
                <Play className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                Play Now
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={onInfoClick}
                className="border-white/30 text-white hover:bg-white/10 transition-all duration-300 text-lg px-8 py-6 rounded-xl font-semibold backdrop-blur-sm hover:scale-105 group"
              >
                <Info className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                More Info
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/10 w-14 h-14 rounded-full transition-all duration-300 hover:scale-110"
              >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white shadow-glow' 
                  : 'bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Age Rating */}
      <div className="absolute top-6 right-6 z-20">
        <Badge variant="outline" className="border-white/30 text-white bg-black/50 backdrop-blur-sm">
          18+
        </Badge>
      </div>
    </section>
  );
};