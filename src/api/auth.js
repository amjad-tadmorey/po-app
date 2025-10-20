import { supabase } from './supabaseClinet';

// Sign up
export const signUp = async (username, password, role) => {
  const email = `${username}@app.local`; // fake email for supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: username, role } },
  });

  if (error) return { data, error };

  // Insert into users table (ignore if already exists)
  await supabase.from('users').upsert([{ id: data.user.id, name: username, role }]);

  // Auto-login after signup
  await supabase.auth.signInWithPassword({ email, password });

  return { data, error: null };
};

// Login
export const signIn = async (username, password) => {
  const email = `${username}@app.local`; // fake email
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Get current user + role
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch from users table, use maybeSingle to avoid PGRST116
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!data) {
    // fallback insert if missing
    await supabase.from('users').insert([
      { id: user.id, name: user.user_metadata.name, role: user.user_metadata.role }
    ]);
    return { ...user, name: user.user_metadata.name, role: user.user_metadata.role };
  }

  return { ...user, ...data };
};
