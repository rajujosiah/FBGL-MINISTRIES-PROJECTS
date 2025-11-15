// Script to populate sample data in Supabase
// Run this script with: node populate-sample-data.js

const { createClient } = require('@supabase/supabase-js');

// You need to set these environment variables or replace with your actual values
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('Please set your Supabase URL and Key in environment variables or update this script');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data
const sampleUsers = [
  {
    email: 'admin@fbglministry.org',
    password: 'admin123',
    role: 'admin',
    profile: {
      name: 'Dr. John Smith',
      phone: '+91-9876543210',
      address: 'FBGL Ministry Headquarters, Hyderabad, Telangana',
      aadhar_no: '123456789012',
      state_code: 'TS',
      district_code: 'HY',
      id_number: 'FBGL-TS-HY-A01'
    }
  },
  {
    email: 'area.manager.ap@fbglministry.org',
    password: 'area123',
    role: 'area_manager',
    profile: {
      name: 'Sarah Johnson',
      phone: '+91-9876543211',
      address: 'East Godavari District, Andhra Pradesh',
      aadhar_no: '123456789013',
      state_code: 'AP',
      district_code: 'EG',
      id_number: 'FBGL-AP-EG-A01'
    }
  },
  {
    email: 'project.manager.ap@fbglministry.org',
    password: 'project123',
    role: 'project_manager',
    profile: {
      name: 'Michael Brown',
      phone: '+91-9876543212',
      address: 'Rajahmundry, East Godavari, Andhra Pradesh',
      aadhar_no: '123456789014',
      state_code: 'AP',
      district_code: 'EG',
      id_number: 'FBGL-AP-EG-P01',
      assigned_to: 'FBGL-AP-EG-A01'
    }
  },
  {
    email: 'social.worker.ap@fbglministry.org',
    password: 'social123',
    role: 'social_worker',
    profile: {
      name: 'Emily Davis',
      phone: '+91-9876543213',
      address: 'Kakinada, East Godavari, Andhra Pradesh',
      aadhar_no: '123456789015',
      state_code: 'AP',
      district_code: 'EG',
      id_number: 'FBGL-AP-EG-S01',
      assigned_to: 'FBGL-AP-EG-P01'
    }
  }
];

const sampleProjects = [
  {
    title: 'Rural Education Support Program',
    description: 'Providing educational support and resources to underprivileged children in rural areas of East Godavari district.',
    category: 'Educational',
    area_of_operation: 'East Godavari District, Andhra Pradesh',
    target_beneficiaries: '500 children aged 6-16 years',
    current_status: 'Active',
    start_date: '2024-01-15',
    end_date: '2024-12-31',
    budget: 250000,
    images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVkdWNhdGlvbiBQcm9qZWN0PC90ZXh0Pjwvc3ZnPg=='],
    assigned_to: 'FBGL-AP-EG-P01'
  },
  {
    title: 'Women Empowerment Initiative',
    description: 'Skill development and micro-finance support for women in rural communities to promote economic independence.',
    category: 'Economic',
    area_of_operation: 'East Godavari District, Andhra Pradesh',
    target_beneficiaries: '200 women aged 18-45 years',
    current_status: 'Active',
    start_date: '2024-02-01',
    end_date: '2024-11-30',
    budget: 180000,
    images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldvbWVuIEVtcG93ZXJtZW50PC90ZXh0Pjwvc3ZnPg=='],
    assigned_to: 'FBGL-AP-EG-P01'
  }
];

const sampleBlogPosts = [
  {
    title: 'FBGL Ministry Annual Report 2024',
    content: 'We are pleased to share our annual report highlighting the significant impact we have made in communities across Andhra Pradesh and Telangana.',
    type: 'blog',
    featured_image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFubnVhbCBSZXBvcnQ8L3RleHQ+PC9zdmc+',
    status: 'published',
    author_id: 'FBGL-TS-HY-A01'
  }
];

const sampleDonations = [
  {
    donor_name: 'Anonymous Donor',
    donor_email: 'donor1@example.com',
    amount: 5000,
    category: 'general',
    payment_method: 'bank_transfer',
    status: 'completed',
    transaction_id: 'TXN001',
    notes: 'General donation for ministry activities'
  }
];

async function populateSampleData() {
  try {
    console.log('Starting to populate sample data...');

    // Create sample users
    console.log('Creating sample users...');
    for (const userData of sampleUsers) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        console.error('Error creating user:', userData.email, authError);
        continue;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: userData.email,
            role: userData.role,
            ...userData.profile
          });

        if (profileError) {
          console.error('Error creating profile:', userData.email, profileError);
        } else {
          console.log('Created user:', userData.email);
        }
      }
    }

    // Create sample projects
    console.log('Creating sample projects...');
    const { error: projectsError } = await supabase
      .from('projects')
      .insert(sampleProjects);

    if (projectsError) {
      console.error('Error creating projects:', projectsError);
    } else {
      console.log('Created sample projects');
    }

    // Create sample blog posts
    console.log('Creating sample blog posts...');
    const { error: blogError } = await supabase
      .from('blog_posts')
      .insert(sampleBlogPosts);

    if (blogError) {
      console.error('Error creating blog posts:', blogError);
    } else {
      console.log('Created sample blog posts');
    }

    // Create sample donations
    console.log('Creating sample donations...');
    const { error: donationsError } = await supabase
      .from('donations')
      .insert(sampleDonations);

    if (donationsError) {
      console.error('Error creating donations:', donationsError);
    } else {
      console.log('Created sample donations');
    }

    console.log('Sample data population completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@fbglministry.org / admin123');
    console.log('Area Manager: area.manager.ap@fbglministry.org / area123');
    console.log('Project Manager: project.manager.ap@fbglministry.org / project123');
    console.log('Social Worker: social.worker.ap@fbglministry.org / social123');

  } catch (error) {
    console.error('Error populating sample data:', error);
  }
}

// Run the script
populateSampleData();

