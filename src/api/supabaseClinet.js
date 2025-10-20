import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wfbzmanmltifrlmfcomx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmYnptYW5tbHRpZnJsbWZjb214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MTM2OTMsImV4cCI6MjA3NjQ4OTY5M30.E8a5i4_82_5olo62K7n9X-9VRQDMrqNvgmfnjIO1Di0';

export const supabase = createClient(supabaseUrl, supabaseKey);
