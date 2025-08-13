import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SocialFeed from '@/components/SocialFeed';
import PremiumFeatures from '@/components/PremiumFeatures';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import GlobalCDN from '@/components/GlobalCDN';
import { useAuth } from '@/hooks/useAuth';
import { useRecommendations } from '@/hooks/useRecommendations';
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
  Download
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { recommendations, loading: recommendationsLoading } = useRecommendations();
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
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user.user_metadata?.full_name || 'User'}!
                </h1>
                <p className="text-muted-foreground">
                  Your personalized streaming dashboard
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={userTier === 'free' ? 'secondary' : 'default'} className="capitalize">
                  <Crown className="h-3 w-3 mr-1" />
                  {userTier}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Watch Time</p>
                  <p className="text-2xl font-bold">24.5h</p>
                  <p className="text-xs text-green-500">+12% this week</p>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Watchlist</p>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-blue-500">3 added today</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Ratings Given</p>
                  <p className="text-2xl font-bold">128</p>
                  <p className="text-xs text-yellow-500">Avg: 4.2/5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                  <p className="text-2xl font-bold">{userTier === 'free' ? '0' : '12'}</p>
                  <p className="text-xs text-purple-500">
                    {userTier === 'free' ? 'Upgrade for downloads' : '2.4GB saved'}
                  </p>
                </div>
                <Download className="h-8 w-8 text-purple-500" />
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="recommendations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Recommendations</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="premium" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Premium</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="network" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Network</span>
              </TabsTrigger>
            </TabsList>

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
              <AdvancedAnalytics />
            </TabsContent>

            <TabsContent value="network">
              <GlobalCDN />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;