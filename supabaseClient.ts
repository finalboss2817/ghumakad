
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldhbigzvifpieeasvefv.supabase.co';
const supabaseKey = 'sb_publishable_VrZhAdx4b0IBfJfJjoz2uw_3SbtNVwu';

export const supabase = createClient(supabaseUrl, supabaseKey);
