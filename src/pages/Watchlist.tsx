import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Heart, Play, Trash2, Loader2, Film, Tv, Zap } from 'lucide-react';

interface WatchlistItem {
  id: string;
  movie_id: string;
  movie_title: string;
  movie_type: string;
  movie_image_url: string | null;
  added_at: string;
}

const Watchlist: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;

      setWatchlist(data || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load watchlist"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (itemId: string) => {
    setRemoving(itemId);
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setWatchlist(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Removed",
        description: "Item removed from watchlist"
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item"
      });
    } finally {
      setRemoving(null);
    }
  };

  const handleWatch = (item: WatchlistItem) => {
    navigate(`/streaming/${item.movie_type}/${item.movie_id}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <Film className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'anime':
        return <Zap className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'tv':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'anime':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your watchlist.
              </p>
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 py-16">
            <div className="flex items-center justify-center space-x-4">
              <Heart className="h-12 w-12 text-red-500 animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                My Watchlist
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your personal collection of movies, TV shows, and anime saved for later. 
              Never lose track of what you want to watch next.
            </p>
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{watchlist.length}</div>
                <div className="text-sm text-muted-foreground">Saved Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Capacity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {watchlist.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-12 shadow-elegant">
                <Heart className="h-20 w-20 mx-auto text-muted-foreground mb-6 animate-pulse" />
                <h2 className="text-3xl font-bold mb-4 text-foreground">Your watchlist is empty</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Start building your personal collection! Add movies, TV shows, and anime 
                  you want to watch later. Your future self will thank you.
                </p>
                <Button 
                  onClick={() => navigate('/')} 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90 px-8 py-3"
                >
                  <Film className="w-5 h-5 mr-2" />
                  Browse Content
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stats Section */}
              <div className="bg-gradient-card border border-border/50 rounded-2xl p-6 shadow-soft">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {watchlist.filter(item => item.movie_type === 'movie').length}
                    </div>
                    <div className="text-muted-foreground flex items-center justify-center space-x-2">
                      <Film className="w-4 h-4" />
                      <span>Movies</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {watchlist.filter(item => item.movie_type === 'tv').length}
                    </div>
                    <div className="text-muted-foreground flex items-center justify-center space-x-2">
                      <Tv className="w-4 h-4" />
                      <span>TV Shows</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {watchlist.filter(item => item.movie_type === 'anime').length}
                    </div>
                    <div className="text-muted-foreground flex items-center justify-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Anime</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Watchlist Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {watchlist.map((item) => (
                  <Card key={item.id} className="group overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-elegant">
                    <div className="relative">
                      <img
                        src={item.movie_image_url || '/placeholder.svg'}
                        alt={item.movie_title}
                        className="w-full h-48 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className={`${getTypeColor(item.movie_type)} backdrop-blur-sm`}>
                          {getTypeIcon(item.movie_type)}
                          <span className="ml-1 capitalize">{item.movie_type}</span>
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                        <Button
                          size="sm"
                          onClick={() => handleWatch(item)}
                          className="bg-white text-black hover:bg-white/90 shadow-glow"
                        >
                          <Play className="w-4 h-4 mr-1 fill-current" />
                          Watch
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromWatchlist(item.id)}
                          disabled={removing === item.id}
                          className="shadow-lg"
                        >
                          {removing === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{item.movie_title}</h3>
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(item.added_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Watchlist;