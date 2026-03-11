'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseBrowser } from '../lib/supabase-browser';

const AuthContext = createContext({ user: null, session: null, loading: true, signOut: async () => {} });

// Ensure user exists in public.users table after auth
async function ensureUserRecord(session) {
  if (!session?.access_token) return;
  try {
    await fetch('/api/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  } catch {
    // Silent fail — user creation will retry on next load
  }
}

export function SupabaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (s?.user) ensureUserRecord(s);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (event === 'SIGNED_IN' && s?.user) {
        ensureUserRecord(s);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseUser() {
  return useContext(AuthContext);
}
