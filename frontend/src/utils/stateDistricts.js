// Predefined list of Indian States and Districts
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

// Districts for each state (most common ones)
export const STATE_DISTRICTS = {
  'Andhra Pradesh': [
    'East Godavari',
    'West Godavari',
    'Krishna',
    'Guntur',
    'Visakhapatnam',
    'Chittoor',
    'Anantapur',
    'Kurnool',
    'Nellore',
    'Prakasam',
    'Srikakulam',
    'Vizianagaram'
  ],
  'Telangana': [
    'Hyderabad',
    'Ranga Reddy',
    'Warangal',
    'Nizamabad',
    'Karimnagar',
    'Medak',
    'Adilabad',
    'Khammam',
    'Mahabubnagar'
  ],
  'Tamil Nadu': [
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
    'Tirunelveli',
    'Erode',
    'Vellore',
    'Thanjavur'
  ],
  'Karnataka': [
    'Bangalore',
    'Mysore',
    'Hubli',
    'Mangalore',
    'Belgaum',
    'Gulbarga',
    'Davanagere'
  ],
  'Kerala': [
    'Thiruvananthapuram',
    'Kochi',
    'Kozhikode',
    'Thrissur',
    'Kannur',
    'Alappuzha'
  ],
  'Maharashtra': [
    'Mumbai',
    'Pune',
    'Nagpur',
    'Thane',
    'Nashik',
    'Aurangabad',
    'Solapur'
  ],
  'Gujarat': [
    'Ahmedabad',
    'Surat',
    'Vadodara',
    'Rajkot',
    'Bhavnagar',
    'Jamnagar'
  ],
  'Rajasthan': [
    'Jaipur',
    'Jodhpur',
    'Kota',
    'Bikaner',
    'Ajmer',
    'Udaipur'
  ],
  'Uttar Pradesh': [
    'Lucknow',
    'Kanpur',
    'Agra',
    'Varanasi',
    'Allahabad',
    'Meerut'
  ],
  'West Bengal': [
    'Kolkata',
    'Howrah',
    'Durgapur',
    'Asansol',
    'Siliguri'
  ],
  'Madhya Pradesh': [
    'Bhopal',
    'Indore',
    'Gwalior',
    'Jabalpur',
    'Ujjain'
  ],
  'Punjab': [
    'Amritsar',
    'Ludhiana',
    'Jalandhar',
    'Patiala',
    'Bathinda'
  ],
  'Haryana': [
    'Gurgaon',
    'Faridabad',
    'Panipat',
    'Ambala',
    'Karnal'
  ],
  'Bihar': [
    'Patna',
    'Gaya',
    'Bhagalpur',
    'Muzaffarpur',
    'Purnia'
  ],
  'Odisha': [
    'Bhubaneswar',
    'Cuttack',
    'Rourkela',
    'Berhampur',
    'Sambalpur'
  ],
  'Assam': [
    'Guwahati',
    'Silchar',
    'Dibrugarh',
    'Jorhat',
    'Nagaon'
  ]
};

// Helper function to get districts for a state
export const getDistrictsForState = (state) => {
  return STATE_DISTRICTS[state] || [];
};

// Helper function to get state code for ID generation
export const getStateCode = (state) => {
  if (!state) return '';
  // Take first 2 letters, handle multi-word states
  const words = state.split(' ');
  if (words.length > 1) {
    return (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase();
  }
  return state.substring(0, 2).toUpperCase();
};

// Helper function to get district code for ID generation
export const getDistrictCode = (district) => {
  if (!district) return '';
  // Take first 2 letters, handle multi-word districts
  const words = district.split(' ');
  if (words.length > 1) {
    return (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase();
  }
  return district.substring(0, 2).toUpperCase();
};


