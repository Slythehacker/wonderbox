import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  subscription_tier: string;
  created_at: string;
}

export const AdminPanel = () => {
  const { isAdmin, loading, updateUserSubscription, getAllUsers } = useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubscriptionChange = async (userId: string, newTier: 'free' | 'premium' | 'vip') => {
    try {
      await updateUserSubscription(userId, newTier);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, subscription_tier: newTier } : user
      ));
      toast({
        title: "Success",
        description: "User subscription updated successfully"
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive"
      });
    }
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'premium': return 'default';
      case 'vip': return 'secondary';
      default: return 'outline';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'vip': return <Crown className="w-4 h-4" />;
      case 'premium': return <Shield className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="bg-destructive/10 border-destructive/20">
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold text-destructive mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Admin Panel
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{user.full_name || 'Unnamed User'}</h4>
                      {user.email === 'bigsly@admin.com' && (
                        <Badge variant="destructive" className="text-xs">ADMIN</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant={getTierBadgeVariant(user.subscription_tier)} className="flex items-center gap-1">
                      {getTierIcon(user.subscription_tier)}
                      {user.subscription_tier.toUpperCase()}
                    </Badge>
                    
                    <Select
                      value={user.subscription_tier}
                      onValueChange={(value: 'free' | 'premium' | 'vip') => 
                        handleSubscriptionChange(user.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};