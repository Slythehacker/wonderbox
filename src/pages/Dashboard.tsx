import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SocialFeed from '@/components/SocialFeed';
import PremiumFeatures from '@/components/PremiumFeatures';
// import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import GlobalCDN from '@/components/GlobalCDN';
import { AdminPanel } from '@/components/AdminPanel';
import { AdvancedDashboard } from '@/components/AdvancedDashboard';
import { MovieDownloadManager } from '@/components/MovieDownloadManager';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
// import { useRecommendations } from '@/hooks/useRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Crown, 
  BarChart3, 
  Globe, 
  Settings,
  Star,
  Play,
  Heart,
  Download,
  HardDrive,
  Upload
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  // Mock data for now
  const recommendations: any[] = [];
  const recommendationsLoading = false;
  const [userTier, setUserTier] = useState<'free' | 'premium' | 'vip'>('free');

  const handleUpgrade = (tier: 'premium' | 'vip') => {
    // In a real app, this would handle payment processing
    console.log(`Upgrading to ${tier}`);
    setUserTier(tier);
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
                Please sign in to access the dashboard.
              </p>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-background via-background to-card/50 animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Background decoration with animation */}
            <div className="absolute inset-0 bg-gradient-border opacity-30 blur-3xl animate-glow-pulse"></div>
            
            <div className="relative bg-gradient-card border border-border/50 rounded-2xl p-8 shadow-elegant hover:shadow-glow transition-all duration-700 animate-scale-in">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
                      <span className="text-white font-bold text-lg">
                        {(user.user_metadata?.full_name || 'Big Sly').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-slide-down">
                        Welcome back, {user.user_metadata?.full_name || 'Big Sly'}!
                      </h1>
                      <p className="text-muted-foreground text-lg animate-slide-down" style={{ animationDelay: '200ms' }}>
                        Your personalized streaming dashboard
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 animate-slide-down" style={{ animationDelay: '400ms' }}>
                  <Badge 
                    variant={userTier === 'free' ? 'secondary' : 'default'} 
                    className="capitalize px-4 py-2 text-sm font-semibold hover:scale-105 transition-transform"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {userTier} Member
                  </Badge>
                  {isAdmin && (
                    <Badge variant="destructive" className="text-xs animate-netflix-bounce">ADMIN</Badge>
                  )}
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Quick Stats with Enhanced Animations */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02] animate-slide-up">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Watch Time</p>
                  <p className="text-2xl font-bold animate-scale-in">24.5h</p>
                  <p className="text-xs text-green-500 animate-fade-in">+12% this week</p>
                </div>
                <Play className="h-8 w-8 text-blue-500 animate-float" />
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02] animate-slide-up" style={{ animationDelay: '100ms' }}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Watchlist</p>
                  <p className="text-2xl font-bold animate-scale-in" style={{ animationDelay: '200ms' }}>47</p>
                  <p className="text-xs text-blue-500 animate-fade-in" style={{ animationDelay: '300ms' }}>3 added today</p>
                </div>
                <Heart className="h-8 w-8 text-red-500 animate-float" style={{ animationDelay: '500ms' }} />
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02] animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Ratings Given</p>
                  <p className="text-2xl font-bold animate-scale-in" style={{ animationDelay: '400ms' }}>128</p>
                  <p className="text-xs text-yellow-500 animate-fade-in" style={{ animationDelay: '500ms' }}>Avg: 4.2/5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500 animate-float" style={{ animationDelay: '1000ms' }} />
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02] animate-slide-up" style={{ animationDelay: '300ms' }}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                  <p className="text-2xl font-bold animate-scale-in" style={{ animationDelay: '600ms' }}>{userTier === 'free' ? '0' : '12'}</p>
                  <p className="text-xs text-purple-500 animate-fade-in" style={{ animationDelay: '700ms' }}>
                    {userTier === 'free' ? 'Upgrade for downloads' : '2.4GB saved'}
                  </p>
                </div>
                <Download className="h-8 w-8 text-purple-500 animate-float" style={{ animationDelay: '1500ms' }} />
              </CardContent>
            </Card>
          </div>

          {/* Admin Panel */}
          {isAdmin && (
            <div className="mb-8">
              <AdminPanel />
            </div>
          )}

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="downloads" className="space-y-6 animate-fade-in">
            <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-7' : 'grid-cols-6'} bg-gradient-card border border-border/50 p-1`}>
              <TabsTrigger value="downloads" className="flex items-center gap-2 transition-all hover:bg-primary/20">
                <HardDrive className="h-4 w-4" />
                <span className="hidden sm:inline">Downloads</span>
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2 transition-all hover:bg-primary/20">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Recommendations</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2 transition-all hover:bg-primary/20">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="premium" className="flex items-center gap-2 transition-all hover:bg-primary/20">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Premium</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 transition-all hover:bg-primary/20">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="network" className="flex items-center gap-2 transition-all hover:bg-primary/20">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Network</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admin" className="flex items-center gap-2 transition-all hover:bg-primary/20">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="downloads" className="space-y-6">
              <AdvancedDashboard />
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendationsLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="aspect-[2/3] bg-muted rounded-lg mb-2" />
                          <div className="h-4 bg-muted rounded mb-1" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {recommendations.slice(0, 12).map((movie) => (
                        <div key={movie.id} className="group cursor-pointer">
                          <div className="aspect-[2/3] relative overflow-hidden rounded-lg mb-2">
                            <img
                              src={movie.imageUrl}
                              alt={movie.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button size="sm">
                                <Play className="h-4 w-4 mr-1" />
                                Play
                              </Button>
                            </div>
                          </div>
                          <h3 className="font-medium text-sm line-clamp-2 mb-1">{movie.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{movie.year}</span>
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span>{movie.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                      <p className="text-muted-foreground">
                        Start watching content to get personalized recommendations
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <SocialFeed />
            </TabsContent>

            <TabsContent value="premium">
              <PremiumFeatures userTier={userTier} onUpgrade={handleUpgrade} />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardContent className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Advanced viewing analytics will be available once you start watching content
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="network">
              <GlobalCDN />
            </TabsContent>

            {isAdmin && (
              <TabsContent value="admin">
                <div className="space-y-6">
                  <AdminPanel />
                  <MovieDownloadManager />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;