import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
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
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <h1 className="text-4xl font-bold">My Watchlist</h1>
            </div>
            <p className="text-muted-foreground">
              Your saved movies, TV shows, and anime to watch later
            </p>
          </div>

          {watchlist.length === 0 ? (
            <Card className="max-w-md mx-auto text-center">
              <CardHeader>
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <CardTitle>Your watchlist is empty</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start adding movies, TV shows, and anime you want to watch later!
                </p>
                <Button onClick={() => navigate('/')}>
                  Browse Content
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {watchlist.map((item) => (
                <Card key={item.id} className="group overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.movie_image_url || '/placeholder.svg'}
                      alt={item.movie_title}
                      className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getTypeColor(item.movie_type)}>
                        {getTypeIcon(item.movie_type)}
                        <span className="ml-1 capitalize">{item.movie_type}</span>
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleWatch(item)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Play className="w-4 h-4 mr-1" fill="currentColor" />
                        Watch
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromWatchlist(item.id)}
                        disabled={removing === item.id}
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
                    <h3 className="font-semibold truncate mb-2">{item.movie_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Added {new Date(item.added_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Watchlist;