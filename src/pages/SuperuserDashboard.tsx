import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Crown, Users, UserCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ArtistRequest {
  id: string;
  user_id: string;
  message: string;
  status: string;
  created_at: string;
  profiles: {
    display_name: string;
    bio: string;
  } | null;
}

export default function SuperuserDashboard() {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ArtistRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for role to load before checking
    if (roleLoading) return;
    
    if (role !== 'superuser') {
      navigate('/');
      return;
    }
    fetchRequests();
  }, [role, roleLoading, navigate]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = data?.map(req => req.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name, bio')
        .in('user_id', userIds);

      // Combine data
      const requestsWithProfiles = data?.map(request => ({
        ...request,
        profiles: profilesData?.find(p => p.user_id === request.user_id) || null
      })) || [];

      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch artist requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, userId: string, action: 'approve' | 'reject') => {
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('artist_requests')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, add artist role
      if (action === 'approve') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'artist' });

        if (roleError) throw roleError;
      }

      toast({
        title: action === 'approve' ? "Request Approved" : "Request Rejected",
        description: `Artist request has been ${action}d successfully`,
      });

      fetchRequests();
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} request`,
        variant: "destructive",
      });
    }
  };

  if (roleLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (role !== 'superuser') {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        <Crown className="h-8 w-8 text-yellow-600" />
        <h1 className="text-3xl font-bold">Superuser Dashboard</h1>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="processed" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Processed ({processedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    No pending artist requests
                  </div>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {request.profiles?.display_name || 'Unknown User'}
                        </CardTitle>
                        <CardDescription>
                          Requested on {new Date(request.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {request.message && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Message:</h4>
                        <p className="text-sm text-muted-foreground">{request.message}</p>
                      </div>
                    )}
                    {request.profiles?.bio && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Bio:</h4>
                        <p className="text-sm text-muted-foreground">{request.profiles.bio}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRequest(request.id, request.user_id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleRequest(request.id, request.user_id, 'reject')}
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="processed">
          <div className="grid gap-4">
            {processedRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    No processed requests
                  </div>
                </CardContent>
              </Card>
            ) : (
              processedRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {request.profiles?.display_name || 'Unknown User'}
                        </CardTitle>
                        <CardDescription>
                          Processed on {new Date(request.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {request.message && (
                      <div className="mb-2">
                        <h4 className="font-medium mb-1">Message:</h4>
                        <p className="text-sm text-muted-foreground">{request.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}