import { createClient } from '@supabase/supabase-js';
import { variable } from '.';

export const supabase = createClient(
    variable.supabase_url!,
    variable.project_key!
);