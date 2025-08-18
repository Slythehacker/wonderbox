import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Download, 
  Play, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Wifi, 
  HardDrive,
  Zap,
  TrendingUp
} from 'lucide-react';

interface MovieStorage {
  id: string;
  movie_id: string;
  movie_title: string;
  movie_type: string;
  file_path?: string;
  trailer_path?: string;
  poster_path?: string;
  thumbnail_path?: string;
  file_size?: number;
  quality: string;
  download_status: string;
  created_at: string;
  updated_at: string;
}

interface UserDownload {
  id: string;
  user_id: string;
  movie_id: string;
  quality_preference: string;
  download_requested_at: string;
  download_completed_at?: string;
  status: string;
}

export const AdvancedDashboard: React.FC = () => {
  const { user } = useAuth();
  const [movieStorage, setMovieStorage] = useState<MovieStorage[]>([]);
  const [userDownloads, setUserDownloads] = useState<UserDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      fetchMovieStorage();
      fetchUserDownloads();
    }
  }, [user]);

  const fetchMovieStorage = async () => {
    try {
      const { data, error } = await supabase
        .from('movie_storage')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovieStorage(data || []);
    } catch (error) {
      console.error('Error fetching movie storage:', error);
    }
  };

  const fetchUserDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from('user_downloads')
        .select('*')
        .eq('user_id', user?.id)
        .order('download_requested_at', { ascending: false });

      if (error) throw error;
      setUserDownloads(data || []);
    } catch (error) {
      console.error('Error fetching user downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestDownload = async (movieId: string, quality: string = '1080p') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_downloads')
        .insert([{
          user_id: user.id,
          movie_id: movieId,
          quality_preference: quality,
          status: 'requested'
        }]);

      if (error) throw error;
      
      // Simulate download progress
      simulateDownloadProgress(movieId);
      fetchUserDownloads();
    } catch (error) {
      console.error('Error requesting download:', error);
    }
  };

  const simulateDownloadProgress = (movieId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Update download status to completed
        updateDownloadStatus(movieId, 'completed');
      }
      setDownloadProgress(prev => ({ ...prev, [movieId]: progress }));
    }, 1000);
  };

  const updateDownloadStatus = async (movieId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('user_downloads')
        .update({ 
          status,
          download_completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('movie_id', movieId)
        .eq('user_id', user?.id);

      if (error) throw error;
      fetchUserDownloads();
    } catch (error) {
      console.error('Error updating download status:', error);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  const getDownloadStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'downloading':
        return <Download className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'requested':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-24 bg-muted rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Movies</p>
                <p className="text-2xl font-bold">{movieStorage.length}</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12 this week
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Downloaded</p>
                <p className="text-2xl font-bold">
                  {userDownloads.filter(d => d.status === 'completed').length}
                </p>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <Wifi className="h-3 w-3 mr-1" />
                  Ready offline
                </p>
              </div>
              <Download className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Storage</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(movieStorage.reduce((acc, movie) => acc + (movie.file_size || 0), 0))}
                </p>
                <p className="text-xs text-purple-500 flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  High quality
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Movies */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Available for Download
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {movieStorage.slice(0, 6).map((movie, index) => (
              <Card 
                key={movie.id} 
                className="group cursor-pointer border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-card hover:scale-[1.02] animate-slide-down"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-16 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                      {movie.poster_path ? (
                        <img 
                          src={`${supabase.storage.from('posters').getPublicUrl(movie.poster_path).data.publicUrl}`}
                          alt={movie.movie_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        movie.movie_title.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {movie.movie_title}
                      </h3>
                      <p className="text-xs text-muted-foreground capitalize mb-2">
                        {movie.movie_type} • {movie.quality}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={movie.download_status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {movie.download_status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(movie.file_size)}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={() => requestDownload(movie.movie_id, movie.quality)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Queue */}
      {userDownloads.length > 0 && (
        <Card className="bg-gradient-card border-border/50 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-500" />
              Your Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userDownloads.map((download) => {
                const movie = movieStorage.find(m => m.movie_id === download.movie_id);
                const progress = downloadProgress[download.movie_id] || 0;
                
                return (
                  <div 
                    key={download.id} 
                    className="flex items-center space-x-4 p-4 rounded-lg border border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-soft"
                  >
                    <div className="w-12 h-16 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {movie?.poster_path ? (
                        <img 
                          src={`${supabase.storage.from('posters').getPublicUrl(movie.poster_path).data.publicUrl}`}
                          alt={movie.movie_title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        movie?.movie_title.charAt(0) || 'M'
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">
                          {movie?.movie_title || 'Unknown Movie'}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getDownloadStatusIcon(download.status)}
                          <Badge variant="outline" className="text-xs">
                            {download.quality_preference}
                          </Badge>
                        </div>
                      </div>
                      
                      {download.status === 'downloading' && (
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {Math.round(progress)}% complete
                          </p>
                        </div>
                      )}
                      
                      {download.status === 'completed' && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-green-500">Download completed</p>
                          <Button size="sm" variant="outline">
                            <Play className="h-3 w-3 mr-1" />
                            Watch
                          </Button>
                        </div>
                      )}
                      
                      {download.status === 'requested' && (
                        <p className="text-xs text-muted-foreground">
                          Queued for download...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};