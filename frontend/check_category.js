
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://znylowwttgxfqxkbikqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueWxvd3d0dGd4ZnF4a2Jpa3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzMyNDIsImV4cCI6MjA3NjgwOTI0Mn0.KwW4SCjQUhi6OEOey3IXOV0jHqAJ-zvcDmZEAqHchcg';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('category')
        .limit(5);

    if (error) {
        console.error('Error fetching projects:', error);
    } else {
        console.log('Existing Project Categories:', data);
    }
}

checkProjects();
