const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://znylowwttgxfqxkbikqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueWxvd3d0dGd4ZnF4a2Jpa3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzMyNDIsImV4cCI6MjA3NjgwOTI0Mn0.KwW4SCjQUhi6OEOey3IXOV0jHqAJ-zvcDmZEAqHchcg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('area_managers').select('id').limit(1);
        if (error) {
            console.error('Connection failed with error:', error);
        } else {
            console.log('Connection successful!', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
