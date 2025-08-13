import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Crown, 
  Download, 
  Zap, 
  Shield, 
  Users, 
  Tv, 
  Headphones,
  Eye,
  Settings,
  Star,
  Sparkles
} from 'lucide-react';

interface PremiumFeaturesProps {
  userTier: 'free' | 'premium' | 'vip';
  onUpgrade: (tier: 'premium' | 'vip') => void;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ userTier, onUpgrade }) => {
  const [downloadQuality, setDownloadQuality] = useState(['1080p']);
  const [simultaneousStreams, setSimultaneousStreams] = useState([2]);
  const [adFreeEnabled, setAdFreeEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);

  const features = {
    free: [
      { name: 'Basic streaming', included: true },
      { name: 'Limited quality (720p)', included: true },
      { name: '1 simultaneous stream', included: true },
      { name: 'Ads included', included: true },
      { name: 'Basic recommendations', included: true }
    ],
    premium: [
      { name: 'HD streaming (1080p)', included: true },
      { name: 'Ad-free experience', included: true },
      { name: '2 simultaneous streams', included: true },
      { name: 'Download for offline', included: true },
      { name: 'Advanced recommendations', included: true },
      { name: 'Early access to content', included: true },
      { name: 'Premium support', included: true }
    ],
    vip: [
      { name: '4K Ultra HD streaming', included: true },
      { name: 'Dolby Atmos audio', included: true },
      { name: '4 simultaneous streams', included: true },
      { name: 'Unlimited downloads', included: true },
      { name: 'AI-powered recommendations', included: true },
      { name: 'Exclusive VIP content', included: true },
      { name: 'Priority customer support', included: true },
      { name: 'Advanced parental controls', included: true },
      { name: 'Watch parties', included: true }
    ]
  };

  const pricing = {
    premium: { monthly: 9.99, yearly: 99.99 },
    vip: { monthly: 15.99, yearly: 159.99 }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className={`border-2 ${
        userTier === 'vip' ? 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50' :
        userTier === 'premium' ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50' :
        'border-gray-300'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className={`h-6 w-6 ${
                userTier === 'vip' ? 'text-yellow-500' :
                userTier === 'premium' ? 'text-blue-500' :
                'text-gray-400'
              }`} />
              <CardTitle className="capitalize">{userTier} Plan</CardTitle>
            </div>
            <Badge variant={userTier === 'free' ? 'secondary' : 'default'} className="capitalize">
              {userTier}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features[userTier].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  feature.included ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Settings (if user has premium/vip) */}
      {userTier !== 'free' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Premium Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Download Quality */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Download Quality</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">720p</span>
                <Slider
                  value={downloadQuality === '4K' ? [3] : downloadQuality === '1080p' ? [2] : [1]}
                  onValueChange={(value) => {
                    const quality = value[0] === 3 ? '4K' : value[0] === 2 ? '1080p' : '720p';
                    setDownloadQuality([quality]);
                  }}
                  max={userTier === 'vip' ? 3 : 2}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">
                  {userTier === 'vip' ? '4K' : '1080p'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {downloadQuality[0]}
              </p>
            </div>

            {/* Simultaneous Streams */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Simultaneous Streams</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">1</span>
                <Slider
                  value={simultaneousStreams}
                  onValueChange={setSimultaneousStreams}
                  max={userTier === 'vip' ? 4 : 2}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">
                  {userTier === 'vip' ? '4' : '2'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Allow {simultaneousStreams[0]} device{simultaneousStreams[0] > 1 ? 's' : ''} to stream simultaneously
              </p>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Ad-free Experience</span>
                </div>
                <Switch checked={adFreeEnabled} onCheckedChange={setAdFreeEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="text-sm font-medium">Offline Downloads</span>
                </div>
                <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
              </div>

              {userTier === 'vip' && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Headphones className="h-4 w-4" />
                      <span className="text-sm font-medium">Dolby Atmos Audio</span>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Watch Parties</span>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Advanced Parental Controls</span>
                    </div>
                    <Switch checked={true} />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Options */}
      {userTier !== 'vip' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Premium Plan */}
          {userTier === 'free' && (
            <Card className="border-blue-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium">
                POPULAR
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  Premium
                </CardTitle>
                <div className="text-3xl font-bold">
                  ${pricing.premium.monthly}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Or ${pricing.premium.yearly}/year (save 17%)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {features.premium.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm">{feature.name}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => onUpgrade('premium')}
                >
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          )}

          {/* VIP Plan */}
          <Card className="border-yellow-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-xs font-medium">
              ULTIMATE
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                VIP
              </CardTitle>
              <div className="text-3xl font-bold">
                ${pricing.vip.monthly}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Or ${pricing.vip.yearly}/year (save 17%)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {features.vip.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-sm">{feature.name}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">+ 3 more features</p>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                onClick={() => onUpgrade('vip')}
              >
                Upgrade to VIP
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-center py-2">Free</th>
                  <th className="text-center py-2">Premium</th>
                  <th className="text-center py-2">VIP</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="py-2">Video Quality</td>
                  <td className="text-center">720p</td>
                  <td className="text-center">1080p</td>
                  <td className="text-center">4K Ultra HD</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Simultaneous Streams</td>
                  <td className="text-center">1</td>
                  <td className="text-center">2</td>
                  <td className="text-center">4</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Downloads</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅ Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Ads</td>
                  <td className="text-center">Yes</td>
                  <td className="text-center">No</td>
                  <td className="text-center">No</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Audio Quality</td>
                  <td className="text-center">Standard</td>
                  <td className="text-center">High</td>
                  <td className="text-center">Dolby Atmos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumFeatures;