import { Button } from "@/components/ui/button";
import { Play, Plus, Info } from "lucide-react";
import heroImage from "@/assets/hero-cinema.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Featured Content"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">
              ✨ Featured Movie
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Wonderful
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Discover unlimited movies, TV shows, and anime. Stream anywhere, anytime. 
              Your entertainment universe awaits.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 animate-glow-pulse"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Watching
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-foreground hover:bg-white/10 backdrop-blur-sm"
              >
                <Info className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>10,000+ Movies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>5,000+ TV Shows</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>3,000+ Anime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;