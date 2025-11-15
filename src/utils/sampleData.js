// Sample Data for FBGL Ministry Website
// This file contains sample data to populate the Supabase database

import { supabase } from '../services/supabaseClient';
import { generateFBGLId } from './idGenerator';

// Sample Users Data
export const sampleUsers = [
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
  },
  {
    email: 'area.manager.ts@fbglministry.org',
    password: 'area123',
    role: 'area_manager',
    profile: {
      name: 'David Wilson',
      phone: '+91-9876543214',
      address: 'Hyderabad District, Telangana',
      aadhar_no: '123456789016',
      state_code: 'TS',
      district_code: 'HY',
      id_number: 'FBGL-TS-HY-A01'
    }
  }
];

// Sample Projects Data
export const sampleProjects = [
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
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVkdWNhdGlvbiBQcm9qZWN0PC90ZXh0Pjwvc3ZnPg=='
    ],
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
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldvbWVuIEVtcG93ZXJtZW50PC90ZXh0Pjwvc3ZnPg=='
    ],
    assigned_to: 'FBGL-AP-EG-P01'
  },
  {
    title: 'Community Health Awareness Program',
    description: 'Health education and awareness programs focusing on hygiene, nutrition, and preventive healthcare in rural areas.',
    category: 'Social',
    area_of_operation: 'East Godavari District, Andhra Pradesh',
    target_beneficiaries: '1000 families',
    current_status: 'Active',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    budget: 120000,
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlYWx0aCBBd2FyZW5lc3M8L3RleHQ+PC9zdmc+'
    ],
    assigned_to: 'FBGL-AP-EG-P01'
  },
  {
    title: 'Digital Literacy Program',
    description: 'Teaching basic computer skills and digital literacy to youth and adults in urban areas.',
    category: 'Educational',
    area_of_operation: 'Hyderabad District, Telangana',
    target_beneficiaries: '300 youth aged 16-30 years',
    current_status: 'Planning',
    start_date: '2024-03-01',
    end_date: '2024-08-31',
    budget: 150000,
    images: [
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRpZ2l0YWwgTGl0ZXJhY3k8L3RleHQ+PC9zdmc+'
    ],
    assigned_to: 'FBGL-TS-HY-A01'
  }
];

// Sample Blog Posts Data
export const sampleBlogPosts = [
  {
    title: 'FBGL Ministry Annual Report 2024',
    content: 'We are pleased to share our annual report highlighting the significant impact we have made in communities across Andhra Pradesh and Telangana. This year, we have successfully implemented 15 projects, reaching over 2,000 beneficiaries.',
    type: 'blog',
    featured_image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFubnVhbCBSZXBvcnQ8L3RleHQ+PC9zdmc+',
    status: 'published',
    author_id: 'FBGL-TS-HY-A01'
  },
  {
    title: 'Upcoming: Community Health Camp',
    content: 'Join us for our monthly community health camp on March 15th, 2024. Free health checkups, medicines, and health awareness sessions will be provided to all community members.',
    type: 'event',
    featured_image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlYWx0aCBDYW1wPC90ZXh0Pjwvc3ZnPg==',
    status: 'published',
    author_id: 'FBGL-AP-EG-P01',
    event_date: '2024-03-15'
  },
  {
    title: 'Success Story: Women Empowerment Program',
    content: 'Meet Priya, a beneficiary of our women empowerment program. Through our skill development training, she started her own tailoring business and now employs 5 other women in her community.',
    type: 'blog',
    featured_image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlN1Y2Nlc3MgU3Rvcnk8L3RleHQ+PC9zdmc+',
    status: 'published',
    author_id: 'FBGL-AP-EG-S01'
  }
];

// Sample Donations Data
export const sampleDonations = [
  {
    donor_name: 'Anonymous Donor',
    donor_email: 'donor1@example.com',
    amount: 5000,
    category: 'general',
    payment_method: 'bank_transfer',
    status: 'completed',
    transaction_id: 'TXN001',
    notes: 'General donation for ministry activities'
  },
  {
    donor_name: 'John Doe',
    donor_email: 'john.doe@example.com',
    amount: 10000,
    category: 'education',
    payment_method: 'paypal',
    status: 'completed',
    transaction_id: 'TXN002',
    notes: 'Donation specifically for education programs'
  },
  {
    donor_name: 'Jane Smith',
    donor_email: 'jane.smith@example.com',
    amount: 2500,
    category: 'health',
    payment_method: 'bank_transfer',
    status: 'pending',
    transaction_id: 'TXN003',
    notes: 'Donation for health awareness programs'
  }
];

// Function to populate sample data
export const populateSampleData = async () => {
  try {
    console.log('Starting to populate sample data...');

    // 1. Create sample users
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
        // Create profile
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

    // 2. Create sample projects
    console.log('Creating sample projects...');
    const { error: projectsError } = await supabase
      .from('projects')
      .insert(sampleProjects);

    if (projectsError) {
      console.error('Error creating projects:', projectsError);
    } else {
      console.log('Created sample projects');
    }

    // 3. Create sample blog posts
    console.log('Creating sample blog posts...');
    const { error: blogError } = await supabase
      .from('blog_posts')
      .insert(sampleBlogPosts);

    if (blogError) {
      console.error('Error creating blog posts:', blogError);
    } else {
      console.log('Created sample blog posts');
    }

    // 4. Create sample donations
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
    return { success: true };

  } catch (error) {
    console.error('Error populating sample data:', error);
    return { success: false, error };
  }
};

// Function to clear all data (for testing)
export const clearAllData = async () => {
  try {
    console.log('Clearing all data...');
    
    // Delete in reverse order of dependencies
    await supabase.from('donations').delete().neq('id', 0);
    await supabase.from('blog_posts').delete().neq('id', 0);
    await supabase.from('projects').delete().neq('id', 0);
    await supabase.from('profiles').delete().neq('id', 0);
    
    console.log('All data cleared successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error clearing data:', error);
    return { success: false, error };
  }
};

