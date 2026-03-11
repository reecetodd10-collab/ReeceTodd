import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

export function createSupabaseServerClient(accessToken) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export async function getAuthUser(request) {
  try {
    // Try Authorization header first
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    // Try cookie fallback (sb-<project-ref>-auth-token)
    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
          const [key, ...val] = c.trim().split('=');
          return [key, val.join('=')];
        })
      );

      // Find the Supabase auth token cookie
      const authCookieKey = Object.keys(cookies).find(k =>
        k.includes('auth-token') || k.includes('sb-')
      );
      if (authCookieKey) {
        try {
          const parsed = JSON.parse(decodeURIComponent(cookies[authCookieKey]));
          token = parsed?.access_token || parsed?.[0]?.access_token;
        } catch {
          token = cookies[authCookieKey];
        }
      }
    }

    if (!token) return null;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}
