import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import heroImage from "@/assets/hero-cinema.jpg";

interface NetflixHeroProps {
  onPlayClick?: () => void;
  onInfoClick?: () => void;
}

const NetflixHero = ({ onPlayClick, onInfoClick }: NetflixHeroProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => (prev + 1) % 100);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Featured Content"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        
        {/* Multiple gradient overlays for Netflix look */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            
            {/* Netflix Original Badge */}
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 px-3 py-1 text-white text-sm font-bold rounded">
                N ORIGINAL
              </div>
              <div className="flex items-center space-x-2 text-white/80 text-sm">
                <span>2024</span>
                <span className="px-2 py-0.5 border border-white/40 text-xs">18+</span>
                <span className="px-2 py-0.5 border border-white/40 text-xs">4K</span>
                <span className="px-2 py-0.5 border border-white/40 text-xs">HDR</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span className="block text-white">WONDER</span>
              <span className="block bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                BOX
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl">
              The ultimate streaming destination. Experience unlimited movies, TV shows, and anime 
              in stunning quality. Your entertainment universe awaits.
            </p>

            {/* Netflix-style Action Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 font-bold px-8 py-3 text-lg"
                onClick={onPlayClick}
              >
                <Play className="mr-3 h-6 w-6 fill-current" />
                Play
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/40 text-white hover:bg-white/20 backdrop-blur-sm font-bold px-8 py-3 text-lg"
                onClick={onInfoClick}
              >
                <Info className="mr-3 h-6 w-6" />
                More Info
              </Button>
            </div>

            {/* Additional Info */}
            <div className="flex items-center space-x-6 pt-6 text-white/70">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm">10,000+ Titles</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm">4K Ultra HD</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm">Dolby Atmos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sound Toggle (Netflix-style) */}
      <div className="absolute bottom-8 right-8 z-20">
        <Button
          variant="outline"
          size="icon"
          className="border-white/40 text-white hover:bg-white/20 backdrop-blur-sm h-12 w-12 rounded-full"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>

      {/* Progress Bar (Netflix-style) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-red-600 transition-all duration-1000"
          style={{ width: `${currentTime}%` }}
        />
      </div>

      {/* Age Rating Badge */}
      <div className="absolute top-20 right-8 bg-black/80 backdrop-blur-sm border border-white/20 px-3 py-2 rounded">
        <span className="text-white text-sm font-bold">16+</span>
      </div>
    </section>
  );
};

export default NetflixHero;