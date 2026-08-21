'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AuthStatus() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>{user.email}</span>
      <button type="button" className="btn-ghost" onClick={cerrarSesion} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
        Cerrar sesión
      </button>
    </div>
  );
}
