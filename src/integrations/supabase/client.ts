// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gpqntusesfdghzskbbsp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcW50dXNlc2ZkZ2h6c2tiYnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODAyMjEsImV4cCI6MjA1NzQ1NjIyMX0.qGNr6ioUYq9tudCR9TlhBfNiVS2QQ505zvzmk7tdL5w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);