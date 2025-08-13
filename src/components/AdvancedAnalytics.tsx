import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Play, 
  Star, 
  Download,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface AnalyticsData {
  watchTime: { date: string; minutes: number }[];
  contentTypes: { name: string; value: number; color: string }[];
  qualityMetrics: { metric: string; value: number; change: number }[];
  deviceStats: { device: string; sessions: number; percentage: number }[];
  popularContent: { title: string; views: number; rating: number }[];
  engagementMetrics: { date: string; engagement: number }[];
}

const AdvancedAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, timeRange]);

  const loadAnalyticsData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load user's playback sessions and QoE data
      const { data: sessions } = await supabase
        .from('playback_sessions')
        .select(`
          *,
          playback_qoe (*)
        `)
        .eq('user_id', user.id)
        .gte('started_at', getDateRange(timeRange))
        .order('started_at', { ascending: false });

      if (sessions) {
        const processedData = processAnalyticsData(sessions);
        setAnalyticsData(processedData);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (range: string) => {
    const now = new Date();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  };

  const processAnalyticsData = (sessions: any[]): AnalyticsData => {
    // Process watch time data
    const watchTimeByDate = sessions.reduce((acc, session) => {
      const date = new Date(session.started_at).toLocaleDateString();
      const watchTime = session.playback_qoe?.[0]?.watch_time_ms || 0;
      acc[date] = (acc[date] || 0) + Math.round(watchTime / 60000); // Convert to minutes
      return acc;
    }, {} as Record<string, number>);

    const watchTime = Object.entries(watchTimeByDate).map(([date, minutes]) => ({
      date,
      minutes
    }));

    // Process content types
    const contentTypeCounts = sessions.reduce((acc, session) => {
      acc[session.content_type] = (acc[session.content_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const contentTypes = Object.entries(contentTypeCounts).map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][index % 4]
    }));

    // Process quality metrics
    const avgStartupTime = sessions.reduce((sum, s) => 
      sum + (s.playback_qoe?.[0]?.startup_time_ms || 0), 0) / sessions.length;
    const avgRebufferCount = sessions.reduce((sum, s) => 
      sum + (s.playback_qoe?.[0]?.rebuffer_count || 0), 0) / sessions.length;
    const avgBitrate = sessions.reduce((sum, s) => 
      sum + (s.playback_qoe?.[0]?.mean_bitrate_kbps || 0), 0) / sessions.length;

    const qualityMetrics = [
      { metric: 'Avg Startup Time', value: Math.round(avgStartupTime), change: -5 },
      { metric: 'Avg Rebuffers', value: Math.round(avgRebufferCount * 100) / 100, change: -12 },
      { metric: 'Avg Bitrate (Mbps)', value: Math.round(avgBitrate / 1000 * 100) / 100, change: 8 }
    ];

    // Process device stats
    const deviceCounts = sessions.reduce((acc, session) => {
      acc[session.device] = (acc[session.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalSessions = sessions.length;
    const deviceStats = Object.entries(deviceCounts).map(([device, sessions]) => ({
      device: device.charAt(0).toUpperCase() + device.slice(1),
      sessions,
      percentage: Math.round((sessions / totalSessions) * 100)
    }));

    // Mock popular content data
    const popularContent = [
      { title: 'The Matrix', views: 1250, rating: 8.7 },
      { title: 'Inception', views: 980, rating: 8.8 },
      { title: 'Interstellar', views: 875, rating: 8.6 },
      { title: 'The Dark Knight', views: 750, rating: 9.0 },
      { title: 'Pulp Fiction', views: 650, rating: 8.9 }
    ];

    // Process engagement metrics
    const engagementByDate = sessions.reduce((acc, session) => {
      const date = new Date(session.started_at).toLocaleDateString();
      const watchTime = session.playback_qoe?.[0]?.watch_time_ms || 0;
      const exitedEarly = session.playback_qoe?.[0]?.exited_early || false;
      const engagement = exitedEarly ? 50 : Math.min(100, (watchTime / 7200000) * 100); // 2 hours = 100%
      acc[date] = (acc[date] || []).concat(engagement);
      return acc;
    }, {} as Record<string, number[]>);

    const engagementMetrics = Object.entries(engagementByDate).map(([date, engagements]) => ({
      date,
      engagement: Math.round(engagements.reduce((a, b) => a + b, 0) / engagements.length)
    }));

    return {
      watchTime,
      contentTypes,
      qualityMetrics,
      deviceStats,
      popularContent,
      engagementMetrics
    };
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-48" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
          <p className="text-muted-foreground">
            Start watching content to see your viewing analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Viewing Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analyticsData.qualityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{metric.metric}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className={`h-3 w-3 ${
                    metric.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`text-xs ${
                    metric.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                {index === 0 && <Zap className="h-6 w-6 text-primary" />}
                {index === 1 && <Play className="h-6 w-6 text-primary" />}
                {index === 2 && <TrendingUp className="h-6 w-6 text-primary" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Watch Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Watch Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.watchTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Engagement Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.engagementMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Types */}
          <Card>
            <CardHeader>
              <CardTitle>Content Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.contentTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.contentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Popular Content */}
          <Card>
            <CardHeader>
              <CardTitle>Most Watched Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.popularContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{content.title}</p>
                        <p className="text-sm text-muted-foreground">{content.views} views</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{content.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          {/* Device Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Device Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.deviceStats.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device.device)}
                      <div>
                        <p className="font-medium">{device.device}</p>
                        <p className="text-sm text-muted-foreground">{device.sessions} sessions</p>
                      </div>
                    </div>
                    <Badge variant="outline">{device.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          {/* Quality Metrics Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Streaming Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Bitrate</span>
                  <Badge variant="outline">
                    {analyticsData.qualityMetrics[2]?.value} Mbps
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Startup Time</span>
                  <Badge variant="outline">
                    {analyticsData.qualityMetrics[0]?.value}ms
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rebuffer Rate</span>
                  <Badge variant="outline">
                    {analyticsData.qualityMetrics[1]?.value}/session
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">92</div>
                <p className="text-sm text-muted-foreground">
                  Excellent streaming quality
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Startup Speed</span>
                    <span className="text-green-500">95%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stability</span>
                    <span className="text-green-500">88%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Video Quality</span>
                    <span className="text-green-500">93%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;