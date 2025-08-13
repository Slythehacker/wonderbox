import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Zap, 
  Server, 
  Wifi, 
  Clock, 
  TrendingUp,
  MapPin,
  Activity,
  Shield,
  Gauge
} from 'lucide-react';

interface CDNNode {
  id: string;
  location: string;
  country: string;
  status: 'online' | 'offline' | 'maintenance';
  latency: number;
  load: number;
  bandwidth: number;
  connections: number;
}

interface NetworkMetrics {
  globalLatency: number;
  totalBandwidth: number;
  activeConnections: number;
  cacheHitRate: number;
  uptime: number;
}

const GlobalCDN: React.FC = () => {
  const [cdnNodes, setCdnNodes] = useState<CDNNode[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCDNData();
    const interval = setInterval(loadCDNData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadCDNData = async () => {
    // Simulate CDN data loading
    const mockNodes: CDNNode[] = [
      {
        id: 'us-east-1',
        location: 'New York',
        country: 'United States',
        status: 'online',
        latency: 12,
        load: 65,
        bandwidth: 850,
        connections: 15420
      },
      {
        id: 'us-west-1',
        location: 'Los Angeles',
        country: 'United States',
        status: 'online',
        latency: 8,
        load: 72,
        bandwidth: 920,
        connections: 18350
      },
      {
        id: 'eu-west-1',
        location: 'London',
        country: 'United Kingdom',
        status: 'online',
        latency: 15,
        load: 58,
        bandwidth: 780,
        connections: 12890
      },
      {
        id: 'eu-central-1',
        location: 'Frankfurt',
        country: 'Germany',
        status: 'online',
        latency: 11,
        load: 45,
        bandwidth: 650,
        connections: 9870
      },
      {
        id: 'ap-southeast-1',
        location: 'Singapore',
        country: 'Singapore',
        status: 'online',
        latency: 18,
        load: 82,
        bandwidth: 1100,
        connections: 22450
      },
      {
        id: 'ap-northeast-1',
        location: 'Tokyo',
        country: 'Japan',
        status: 'online',
        latency: 14,
        load: 69,
        bandwidth: 890,
        connections: 16780
      },
      {
        id: 'ap-south-1',
        location: 'Mumbai',
        country: 'India',
        status: 'maintenance',
        latency: 25,
        load: 0,
        bandwidth: 0,
        connections: 0
      },
      {
        id: 'sa-east-1',
        location: 'São Paulo',
        country: 'Brazil',
        status: 'online',
        latency: 22,
        load: 55,
        bandwidth: 420,
        connections: 7650
      }
    ];

    const mockMetrics: NetworkMetrics = {
      globalLatency: Math.round(mockNodes.filter(n => n.status === 'online').reduce((sum, n) => sum + n.latency, 0) / mockNodes.filter(n => n.status === 'online').length),
      totalBandwidth: mockNodes.reduce((sum, n) => sum + n.bandwidth, 0),
      activeConnections: mockNodes.reduce((sum, n) => sum + n.connections, 0),
      cacheHitRate: 94.2,
      uptime: 99.97
    };

    setCdnNodes(mockNodes);
    setNetworkMetrics(mockMetrics);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getLoadColor = (load: number) => {
    if (load < 50) return 'text-green-500';
    if (load < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredNodes = selectedRegion === 'all' 
    ? cdnNodes 
    : cdnNodes.filter(node => {
        if (selectedRegion === 'americas') return node.country === 'United States' || node.country === 'Brazil';
        if (selectedRegion === 'europe') return node.country === 'United Kingdom' || node.country === 'Germany';
        if (selectedRegion === 'asia') return ['Singapore', 'Japan', 'India'].includes(node.country);
        return true;
      });

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-48" />
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Global CDN Network</h2>
            <p className="text-muted-foreground">Real-time network performance monitoring</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedRegion === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedRegion('all')}
          >
            All Regions
          </Button>
          <Button 
            variant={selectedRegion === 'americas' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedRegion('americas')}
          >
            Americas
          </Button>
          <Button 
            variant={selectedRegion === 'europe' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedRegion('europe')}
          >
            Europe
          </Button>
          <Button 
            variant={selectedRegion === 'asia' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedRegion('asia')}
          >
            Asia Pacific
          </Button>
        </div>
      </div>

      {/* Global Metrics */}
      {networkMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Global Latency</p>
                <p className="text-2xl font-bold">{networkMetrics.globalLatency}ms</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Bandwidth</p>
                <p className="text-2xl font-bold">{(networkMetrics.totalBandwidth / 1000).toFixed(1)}Tbps</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Active Connections</p>
                <p className="text-2xl font-bold">{(networkMetrics.activeConnections / 1000).toFixed(0)}K</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
                <p className="text-2xl font-bold">{networkMetrics.cacheHitRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{networkMetrics.uptime}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* CDN Nodes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            CDN Nodes ({filteredNodes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNodes.map((node) => (
              <Card key={node.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-semibold">{node.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)}`} />
                      <Badge variant="outline" className="text-xs capitalize">
                        {node.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{node.country}</p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {node.status === 'online' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Latency</span>
                        <Badge variant="outline">{node.latency}ms</Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Load</span>
                          <span className={`text-sm font-medium ${getLoadColor(node.load)}`}>
                            {node.load}%
                          </span>
                        </div>
                        <Progress value={node.load} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Bandwidth</span>
                        <Badge variant="outline">{node.bandwidth}Gbps</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Connections</span>
                        <Badge variant="outline">{node.connections.toLocaleString()}</Badge>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Gauge className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {node.status === 'maintenance' ? 'Under Maintenance' : 'Offline'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Network Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Overall Performance</span>
                <span className="text-sm font-medium text-green-500">Excellent</span>
              </div>
              <Progress value={95} className="h-2" />
              <p className="text-xs text-muted-foreground">95% of nodes performing optimally</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Global Coverage</span>
                <span className="text-sm font-medium text-blue-500">8 Regions</span>
              </div>
              <Progress value={88} className="h-2" />
              <p className="text-xs text-muted-foreground">Covering 88% of global traffic</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Redundancy</span>
                <span className="text-sm font-medium text-purple-500">High</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">92% failover capability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalCDN;