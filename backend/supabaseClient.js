
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY in environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Connected to Supabase!');

module.exports = supabase;
