import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'superuser' | 'artist' | 'user';

export function useUserRole() {
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;
    
    console.log('Fetching role for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      console.log('Role query result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
        return;
      }

      const userRole = data?.role || 'user';
      console.log('Setting user role to:', userRole);
      setRole(userRole);
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRole: UserRole) => {
    const roleHierarchy = { user: 0, artist: 1, superuser: 2 };
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  return { role, loading, hasRole, refetch: fetchUserRole };
}