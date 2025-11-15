// Sample data for testing when Supabase is not configured
export const sampleAreaManagers = [
  {
    id: 1,
    name: 'John Doe',
    id_no: 'FBGL AP EG A01',
    profile_picture: 'https://randomuser.me/api/portraits/men/32.jpg',
    area_manager: 'Andhra Pradesh - East Godavari',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '123 Main Street, Rajahmundry, East Godavari',
    phone: '+91 98765 43210',
    email: 'john.doe@fbgl.org',
    aadhaar_no: 'XXXX XXXX 1234',
    bio: 'Dedicated Area Manager with 10 years of experience in community development.',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    id_no: 'FBGL AP WG A02',
    profile_picture: 'https://randomuser.me/api/portraits/women/44.jpg',
    area_manager: 'Andhra Pradesh - West Godavari',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    address: '456 Church Road, Eluru, West Godavari',
    phone: '+91 98765 43211',
    email: 'jane.smith@fbgl.org',
    aadhaar_no: 'XXXX XXXX 5678',
    bio: 'Passionate about transforming communities through education and empowerment.',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Rajesh Kumar',
    id_no: 'FBGL AP KR A03',
    profile_picture: 'https://randomuser.me/api/portraits/men/78.jpg',
    area_manager: 'Andhra Pradesh - Krishna',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    address: '789 Mission Road, Vijayawada, Krishna',
    phone: '+91 98765 43218',
    email: 'rajesh.k@fbgl.org',
    aadhaar_no: 'XXXX XXXX 6789',
    bio: 'Experienced community leader dedicated to social transformation and empowerment.',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Priya Sharma',
    id_no: 'FBGL AP CH A04',
    profile_picture: 'https://randomuser.me/api/portraits/women/56.jpg',
    area_manager: 'Andhra Pradesh - Chittoor',
    state: 'Andhra Pradesh',
    district: 'Chittoor',
    address: '321 Service Street, Tirupati, Chittoor',
    phone: '+91 98765 43219',
    email: 'priya.s@fbgl.org',
    aadhaar_no: 'XXXX XXXX 7890',
    bio: 'Committed to educational excellence and community welfare programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Mohammed Ali',
    id_no: 'FBGL TG HY A05',
    profile_picture: 'https://randomuser.me/api/portraits/men/62.jpg',
    area_manager: 'Telangana - Hyderabad',
    state: 'Telangana',
    district: 'Hyderabad',
    address: '555 Development Avenue, Hyderabad',
    phone: '+91 98765 43220',
    email: 'mohammed.a@fbgl.org',
    aadhaar_no: 'XXXX XXXX 8901',
    bio: 'Dedicated to urban community development and youth empowerment initiatives.',
    created_at: new Date().toISOString()
  }
];

export const sampleProjectManagers = [
  {
    id: 1,
    area_manager_id: 1,
    name: 'Michael Johnson',
    id_no: 'FBGL AP EG P01',
    profile_picture: 'https://randomuser.me/api/portraits/men/45.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '789 Project Avenue, Rajahmundry',
    phone: '+91 98765 43212',
    email: 'michael.j@fbgl.org',
    aadhaar_no: 'XXXX XXXX 9012',
    bio: 'Project Manager specializing in educational initiatives.',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    area_manager_id: 1,
    name: 'Sarah Williams',
    id_no: 'FBGL AP EG P02',
    profile_picture: 'https://randomuser.me/api/portraits/women/68.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '321 Development Lane, Kakinada',
    phone: '+91 98765 43213',
    email: 'sarah.w@fbgl.org',
    aadhaar_no: 'XXXX XXXX 3456',
    bio: 'Focused on economic empowerment programs for women.',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    area_manager_id: 1,
    name: 'Thomas George',
    id_no: 'FBGL AP EG P03',
    profile_picture: 'https://randomuser.me/api/portraits/men/71.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '888 Community Road, Amalapuram',
    phone: '+91 98765 43221',
    email: 'thomas.g@fbgl.org',
    aadhaar_no: 'XXXX XXXX 9012',
    bio: 'Specializing in healthcare and nutrition programs for rural communities.',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    area_manager_id: 2,
    name: 'Rebecca Johnson',
    id_no: 'FBGL AP WG P04',
    profile_picture: 'https://randomuser.me/api/portraits/women/73.jpg',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    address: '444 Empowerment Street, Eluru',
    phone: '+91 98765 43222',
    email: 'rebecca.j@fbgl.org',
    aadhaar_no: 'XXXX XXXX 0123',
    bio: 'Leading educational initiatives and scholarship programs for underprivileged students.',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    area_manager_id: 2,
    name: 'James Wilson',
    id_no: 'FBGL AP WG P05',
    profile_picture: 'https://randomuser.me/api/portraits/men/74.jpg',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    address: '666 Service Lane, Bhimavaram',
    phone: '+91 98765 43223',
    email: 'james.w@fbgl.org',
    aadhaar_no: 'XXXX XXXX 1234',
    bio: 'Focused on agricultural development and farmer training programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    area_manager_id: 3,
    name: 'Anita Reddy',
    id_no: 'FBGL AP KR P06',
    profile_picture: 'https://randomuser.me/api/portraits/women/76.jpg',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    address: '777 Mission Road, Vijayawada',
    phone: '+91 98765 43224',
    email: 'anita.r@fbgl.org',
    aadhaar_no: 'XXXX XXXX 2345',
    bio: 'Expert in vocational training and skill development programs for youth.',
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    area_manager_id: 3,
    name: 'Samuel Moses',
    id_no: 'FBGL AP KR P07',
    profile_picture: 'https://randomuser.me/api/portraits/men/77.jpg',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    address: '999 Hope Avenue, Guntur',
    phone: '+91 98765 43225',
    email: 'samuel.m@fbgl.org',
    aadhaar_no: 'XXXX XXXX 3456',
    bio: 'Committed to child welfare and protection programs in rural areas.',
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    area_manager_id: 4,
    name: 'Grace Mary',
    id_no: 'FBGL AP CH P08',
    profile_picture: 'https://randomuser.me/api/portraits/women/79.jpg',
    state: 'Andhra Pradesh',
    district: 'Chittoor',
    address: '111 Charity Lane, Tirupati',
    phone: '+91 98765 43226',
    email: 'grace.m@fbgl.org',
    aadhaar_no: 'XXXX XXXX 4567',
    bio: 'Passionate about women empowerment and microfinance initiatives.',
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    area_manager_id: 5,
    name: 'Ibrahim Khan',
    id_no: 'FBGL TG HY P09',
    profile_picture: 'https://randomuser.me/api/portraits/men/80.jpg',
    state: 'Telangana',
    district: 'Hyderabad',
    address: '222 Unity Road, Secunderabad',
    phone: '+91 98765 43227',
    email: 'ibrahim.k@fbgl.org',
    aadhaar_no: 'XXXX XXXX 5678',
    bio: 'Specializing in urban community development and digital inclusion programs.',
    created_at: new Date().toISOString()
  }
];

export const sampleSocialWorkers = [
  {
    id: 1,
    project_manager_id: 1,
    name: 'David Brown',
    id_no: 'FBGL AP EG S01',
    profile_picture: 'https://randomuser.me/api/portraits/men/52.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '654 Worker Street, Rajahmundry',
    phone: '+91 98765 43214',
    email: 'david.b@fbgl.org',
    aadhaar_no: 'XXXX XXXX 7890',
    bio: 'Dedicated social worker committed to serving the community.',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    project_manager_id: 1,
    name: 'Emma Davis',
    id_no: 'FBGL AP EG S02',
    profile_picture: 'https://randomuser.me/api/portraits/women/50.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '987 Service Road, Kakinada',
    phone: '+91 98765 43215',
    email: 'emma.d@fbgl.org',
    aadhaar_no: 'XXXX XXXX 2345',
    bio: 'Passionate about children\'s education and welfare programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    project_manager_id: 1,
    name: 'Robert Wilson',
    id_no: 'FBGL AP EG S03',
    profile_picture: 'https://randomuser.me/api/portraits/men/67.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '555 Service Lane, Rajahmundry',
    phone: '+91 98765 43216',
    email: 'robert.w@fbgl.org',
    aadhaar_no: 'XXXX XXXX 3456',
    bio: 'Community development specialist focused on rural empowerment.',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    project_manager_id: 1,
    name: 'Lisa Anderson',
    id_no: 'FBGL AP EG S04',
    profile_picture: 'https://randomuser.me/api/portraits/women/75.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '222 Help Street, Kakinada',
    phone: '+91 98765 43217',
    email: 'lisa.a@fbgl.org',
    aadhaar_no: 'XXXX XXXX 4567',
    bio: 'Advocate for women\'s rights and economic independence.',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    project_manager_id: 1,
    name: 'Peter Samuel',
    id_no: 'FBGL AP EG S05',
    profile_picture: 'https://randomuser.me/api/portraits/men/81.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '333 Care Lane, Rajahmundry',
    phone: '+91 98765 43228',
    email: 'peter.s@fbgl.org',
    aadhaar_no: 'XXXX XXXX 6789',
    bio: 'Dedicated to youth development and career counseling programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    project_manager_id: 2,
    name: 'Mary George',
    id_no: 'FBGL AP EG S06',
    profile_picture: 'https://randomuser.me/api/portraits/women/82.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '444 Support Road, Kakinada',
    phone: '+91 98765 43229',
    email: 'mary.g@fbgl.org',
    aadhaar_no: 'XXXX XXXX 7890',
    bio: 'Focused on elderly care and senior citizen welfare programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    project_manager_id: 2,
    name: 'Daniel Joseph',
    id_no: 'FBGL AP EG S07',
    profile_picture: 'https://randomuser.me/api/portraits/men/83.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '555 Hope Street, Amalapuram',
    phone: '+91 98765 43230',
    email: 'daniel.j@fbgl.org',
    aadhaar_no: 'XXXX XXXX 8901',
    bio: 'Committed to disability support and inclusive development programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    project_manager_id: 3,
    name: 'Ruth Abraham',
    id_no: 'FBGL AP EG S08',
    profile_picture: 'https://randomuser.me/api/portraits/women/84.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '666 Faith Avenue, Rajahmundry',
    phone: '+91 98765 43231',
    email: 'ruth.a@fbgl.org',
    aadhaar_no: 'XXXX XXXX 9012',
    bio: 'Passionate about healthcare access and medical camp coordination.',
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    project_manager_id: 3,
    name: 'Jacob Mathew',
    id_no: 'FBGL AP EG S09',
    profile_picture: 'https://randomuser.me/api/portraits/men/85.jpg',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    address: '777 Grace Road, Kakinada',
    phone: '+91 98765 43232',
    email: 'jacob.m@fbgl.org',
    aadhaar_no: 'XXXX XXXX 0123',
    bio: 'Specializing in environmental awareness and conservation programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    project_manager_id: 4,
    name: 'Sophia Benjamin',
    id_no: 'FBGL AP WG S10',
    profile_picture: 'https://randomuser.me/api/portraits/women/86.jpg',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    address: '888 Love Lane, Eluru',
    phone: '+91 98765 43233',
    email: 'sophia.b@fbgl.org',
    aadhaar_no: 'XXXX XXXX 1234',
    bio: 'Dedicated to education support and scholarship distribution programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    project_manager_id: 4,
    name: 'Mark Thomas',
    id_no: 'FBGL AP WG S11',
    profile_picture: 'https://randomuser.me/api/portraits/men/87.jpg',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    address: '999 Peace Street, Bhimavaram',
    phone: '+91 98765 43234',
    email: 'mark.t@fbgl.org',
    aadhaar_no: 'XXXX XXXX 2345',
    bio: 'Committed to rural development and infrastructure improvement projects.',
    created_at: new Date().toISOString()
  },
  {
    id: 12,
    project_manager_id: 5,
    name: 'Esther David',
    id_no: 'FBGL AP WG S12',
    profile_picture: 'https://randomuser.me/api/portraits/women/88.jpg',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    address: '111 Joy Road, Eluru',
    phone: '+91 98765 43235',
    email: 'esther.d@fbgl.org',
    aadhaar_no: 'XXXX XXXX 3456',
    bio: 'Focused on agricultural training and sustainable farming practices.',
    created_at: new Date().toISOString()
  },
  {
    id: 13,
    project_manager_id: 6,
    name: 'Noah Philip',
    id_no: 'FBGL AP KR S13',
    profile_picture: 'https://randomuser.me/api/portraits/men/89.jpg',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    address: '222 Skill Avenue, Vijayawada',
    phone: '+91 98765 43236',
    email: 'noah.p@fbgl.org',
    aadhaar_no: 'XXXX XXXX 4567',
    bio: 'Expert in vocational training and employment assistance programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 14,
    project_manager_id: 6,
    name: 'Hannah Sarah',
    id_no: 'FBGL AP KR S14',
    profile_picture: 'https://randomuser.me/api/portraits/women/90.jpg',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    address: '333 Training Lane, Guntur',
    phone: '+91 98765 43237',
    email: 'hannah.s@fbgl.org',
    aadhaar_no: 'XXXX XXXX 5678',
    bio: 'Passionate about skill development and career guidance for youth.',
    created_at: new Date().toISOString()
  },
  {
    id: 15,
    project_manager_id: 7,
    name: 'Joshua Daniel',
    id_no: 'FBGL AP KR S15',
    profile_picture: 'https://randomuser.me/api/portraits/men/91.jpg',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    address: '444 Child Care Street, Vijayawada',
    phone: '+91 98765 43238',
    email: 'joshua.d@fbgl.org',
    aadhaar_no: 'XXXX XXXX 6789',
    bio: 'Dedicated to child protection and welfare programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 16,
    project_manager_id: 8,
    name: 'Lydia John',
    id_no: 'FBGL AP CH S16',
    profile_picture: 'https://randomuser.me/api/portraits/women/92.jpg',
    state: 'Andhra Pradesh',
    district: 'Chittoor',
    address: '555 Women\'s Street, Tirupati',
    phone: '+91 98765 43239',
    email: 'lydia.j@fbgl.org',
    aadhaar_no: 'XXXX XXXX 7890',
    bio: 'Committed to women empowerment and financial literacy programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 17,
    project_manager_id: 9,
    name: 'Andrew Paul',
    id_no: 'FBGL TG HY S17',
    profile_picture: 'https://randomuser.me/api/portraits/men/93.jpg',
    state: 'Telangana',
    district: 'Hyderabad',
    address: '666 Digital Road, Secunderabad',
    phone: '+91 98765 43240',
    email: 'andrew.p@fbgl.org',
    aadhaar_no: 'XXXX XXXX 8901',
    bio: 'Specializing in digital literacy and technology access programs.',
    created_at: new Date().toISOString()
  },
  {
    id: 18,
    project_manager_id: 9,
    name: 'Martha Luke',
    id_no: 'FBGL TG HY S18',
    profile_picture: 'https://randomuser.me/api/portraits/women/94.jpg',
    state: 'Telangana',
    district: 'Hyderabad',
    address: '777 Community Avenue, Hyderabad',
    phone: '+91 98765 43241',
    email: 'martha.l@fbgl.org',
    aadhaar_no: 'XXXX XXXX 9012',
    bio: 'Focused on urban community engagement and neighborhood development.',
    created_at: new Date().toISOString()
  }
];

export const sampleProjects = [
  {
    id: 1,
    social_worker_id: 1,
    title: 'Free Education for Underprivileged Children',
    description: 'Providing free education and school supplies to children from low-income families in rural areas.',
    area_of_operation: 'Rajahmundry, East Godavari',
    target_beneficiaries: '200 children aged 6-14 years',
    status: 'Ongoing',
    location: 'Rajahmundry, East Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    social_worker_id: 1,
    title: 'Women\'s Skill Development Program',
    description: 'Empowering women through vocational training in tailoring, computer skills, and entrepreneurship.',
    area_of_operation: 'Kakinada, East Godavari',
    target_beneficiaries: '150 women aged 18-45 years',
    status: 'Ongoing',
    location: 'Kakinada, East Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    social_worker_id: 2,
    title: 'Community Health Awareness Campaign',
    description: 'Raising awareness about hygiene, nutrition, and preventive healthcare in rural communities.',
    area_of_operation: 'Various villages in East Godavari',
    target_beneficiaries: '500 community members',
    status: 'Completed',
    location: 'East Godavari District, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    social_worker_id: 1,
    title: 'Digital Literacy Program',
    description: 'Teaching basic computer skills and internet usage to rural youth and adults.',
    area_of_operation: 'Rajahmundry, East Godavari',
    target_beneficiaries: '100 participants aged 16-40 years',
    status: 'Ongoing',
    location: 'Rajahmundry, East Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    social_worker_id: 3,
    title: 'Agricultural Training Workshop',
    description: 'Providing modern farming techniques and sustainable agriculture practices to farmers.',
    area_of_operation: 'Rural areas, East Godavari',
    target_beneficiaries: '300 farmers',
    status: 'Ongoing',
    location: 'East Godavari District, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    social_worker_id: 4,
    title: 'Women Entrepreneurship Development',
    description: 'Training and supporting women to start their own small businesses and become financially independent.',
    area_of_operation: 'Kakinada, East Godavari',
    target_beneficiaries: '120 women entrepreneurs',
    status: 'Ongoing',
    location: 'Kakinada, East Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    social_worker_id: 5,
    title: 'Career Counseling and Job Placement',
    description: 'Providing career guidance, resume building, and job placement assistance for unemployed youth.',
    area_of_operation: 'Rajahmundry, East Godavari',
    target_beneficiaries: '250 youth aged 18-30 years',
    status: 'Ongoing',
    location: 'Rajahmundry, East Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    social_worker_id: 6,
    title: 'Senior Citizen Care Program',
    description: 'Providing healthcare, companionship, and support services for elderly people in the community.',
    area_of_operation: 'Kakinada, East Godavari',
    target_beneficiaries: '180 senior citizens',
    status: 'Ongoing',
    location: 'Kakinada, East Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    social_worker_id: 7,
    title: 'Disability Support and Inclusion',
    description: 'Empowering persons with disabilities through skill training, assistive devices, and advocacy programs.',
    area_of_operation: 'Amalapuram, East Godavari',
    target_beneficiaries: '100 persons with disabilities',
    status: 'Ongoing',
    location: 'Amalapuram, East Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    social_worker_id: 8,
    title: 'Rural Health Camp Series',
    description: 'Organizing free health check-ups, medical camps, and awareness sessions in remote villages.',
    area_of_operation: 'Various villages, East Godavari',
    target_beneficiaries: '600 villagers',
    status: 'Ongoing',
    location: 'East Godavari District, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    social_worker_id: 9,
    title: 'Environmental Awareness Campaign',
    description: 'Promoting environmental conservation, tree plantation, and waste management practices.',
    area_of_operation: 'Kakinada, East Godavari',
    target_beneficiaries: '400 community members',
    status: 'Ongoing',
    location: 'Kakinada, East Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 12,
    social_worker_id: 10,
    title: 'Scholarship Distribution Program',
    description: 'Providing financial assistance and scholarships to meritorious students from economically weak families.',
    area_of_operation: 'Eluru, West Godavari',
    target_beneficiaries: '150 students',
    status: 'Ongoing',
    location: 'Eluru, West Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 13,
    social_worker_id: 11,
    title: 'Rural Infrastructure Development',
    description: 'Improving access roads, community centers, and basic amenities in remote villages.',
    area_of_operation: 'Bhimavaram, West Godavari',
    target_beneficiaries: '500 villagers',
    status: 'Ongoing',
    location: 'Bhimavaram, West Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 14,
    social_worker_id: 12,
    title: 'Sustainable Agriculture Initiative',
    description: 'Training farmers in organic farming, crop rotation, and eco-friendly agricultural practices.',
    area_of_operation: 'Eluru, West Godavari',
    target_beneficiaries: '200 farmers',
    status: 'Ongoing',
    location: 'Eluru, West Godavari, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 15,
    social_worker_id: 13,
    title: 'Vocational Training Center',
    description: 'Providing hands-on training in tailoring, plumbing, electrical work, and other skilled trades.',
    area_of_operation: 'Vijayawada, Krishna',
    target_beneficiaries: '180 trainees',
    status: 'Ongoing',
    location: 'Vijayawada, Krishna, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 16,
    social_worker_id: 14,
    title: 'Youth Skill Development Program',
    description: 'Training young people in soft skills, communication, and professional development.',
    area_of_operation: 'Guntur, Krishna',
    target_beneficiaries: '220 youth',
    status: 'Ongoing',
    location: 'Guntur, Krishna, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 17,
    social_worker_id: 15,
    title: 'Child Protection and Safety',
    description: 'Creating safe spaces for children, preventing child labor, and supporting child rights.',
    area_of_operation: 'Vijayawada, Krishna',
    target_beneficiaries: '300 children',
    status: 'Ongoing',
    location: 'Vijayawada, Krishna, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 18,
    social_worker_id: 16,
    title: 'Women\'s Financial Literacy Program',
    description: 'Educating women about banking, savings, loans, and financial planning for economic empowerment.',
    area_of_operation: 'Tirupati, Chittoor',
    target_beneficiaries: '160 women',
    status: 'Ongoing',
    location: 'Tirupati, Chittoor, Andhra Pradesh',
    images: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 19,
    social_worker_id: 17,
    title: 'Digital Literacy for All',
    description: 'Teaching basic computer skills, internet usage, and digital payment methods to urban residents.',
    area_of_operation: 'Secunderabad, Hyderabad',
    target_beneficiaries: '180 participants',
    status: 'Ongoing',
    location: 'Secunderabad, Hyderabad, Telangana',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 20,
    social_worker_id: 18,
    title: 'Urban Community Engagement',
    description: 'Building strong neighborhoods through community events, volunteer programs, and social activities.',
    area_of_operation: 'Hyderabad',
    target_beneficiaries: '350 community members',
    status: 'Ongoing',
    location: 'Hyderabad, Telangana',
    images: [
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&h=600&fit=crop'
    ],
    created_at: new Date().toISOString()
  }
];

export const sampleBoardMembers = [
  {
    id: 1,
    name: 'Rev. Dr. Abraham Thomas',
    position: 'Founder & Director',
    bio: 'Founder of FIRST BORN GOSPEL LIFE MINISTRIES with a vision to transform lives through the Gospel.',
    profile_picture: 'https://randomuser.me/api/portraits/men/75.jpg',
    email: 'director@fbgl.org',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Mrs. Mary Joseph',
    position: 'Vice President',
    bio: 'Dedicated leader with extensive experience in social work and community development.',
    profile_picture: 'https://randomuser.me/api/portraits/women/65.jpg',
    email: 'vicepresident@fbgl.org',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Mr. Peter Kumar',
    position: 'Secretary',
    bio: 'Administrative expert managing ministry operations and outreach programs.',
    profile_picture: 'https://randomuser.me/api/portraits/men/55.jpg',
    email: 'secretary@fbgl.org',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Mrs. Sarah Mathew',
    position: 'Treasurer',
    bio: 'Financial expert managing ministry resources and ensuring transparency in all operations.',
    profile_picture: 'https://randomuser.me/api/portraits/women/48.jpg',
    email: 'treasurer@fbgl.org',
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Mr. Joseph Abraham',
    position: 'Board Member',
    bio: 'Community leader with extensive experience in social service and community outreach programs.',
    profile_picture: 'https://randomuser.me/api/portraits/men/95.jpg',
    email: 'joseph.a@fbgl.org',
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Mrs. Rachel Benjamin',
    position: 'Board Member',
    bio: 'Education specialist committed to improving access to quality education for all children.',
    profile_picture: 'https://randomuser.me/api/portraits/women/96.jpg',
    email: 'rachel.b@fbgl.org',
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Dr. Simon Daniel',
    position: 'Advisory Member',
    bio: 'Public health expert providing guidance on healthcare and nutrition programs.',
    profile_picture: 'https://randomuser.me/api/portraits/men/97.jpg',
    email: 'simon.d@fbgl.org',
    created_at: new Date().toISOString()
  }
];

