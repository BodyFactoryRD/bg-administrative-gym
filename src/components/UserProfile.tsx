'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading };
}

export default function UserProfile() {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return (
    <div>
      {user ? (
        <div>
          <p>{user.email}</p>
          <p>{user.user_metadata?.name || 'Usuario'}</p>
        </div>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  );
}
