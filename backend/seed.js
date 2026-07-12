require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const Project = require('./models/Project');
const BlogPost = require('./models/BlogPost');
const StateDistrict = require('./models/StateDistrict');
const SiteSettings = require('./models/SiteSettings');

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://fbglministries2016_db_user:LuyNgH2gPY7fuOi9@cluster0.zw4qyzh.mongodb.net/?appName=Cluster0';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    const bcrypt = require('bcryptjs');
    const defaultPassword = await bcrypt.hash('asdf1234', 10);
    try {
      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
      console.log('Connected to MongoDB Atlas Cloud.');
    } catch (atlasErr) {
      console.warn('⚠️ MongoDB Atlas connection failed:', atlasErr.message);
      console.log('🔄 Trying to connect to local MongoDB (mongodb://127.0.0.1:27017/fbgl)...');
      await mongoose.connect('mongodb://127.0.0.1:27017/fbgl', { serverSelectionTimeoutMS: 5000 });
      console.log('Connected to Local MongoDB.');
    }

    // 1. Clear database
    console.log('Clearing existing data...');
    await Promise.all([
      Profile.deleteMany({}),
      Project.deleteMany({}),
      BlogPost.deleteMany({}),
      StateDistrict.deleteMany({}),
      SiteSettings.deleteMany({})
    ]);
    console.log('Database cleared.');

    // 2. Insert Site Settings
    console.log('Seeding site settings...');
    const settings = new SiteSettings({
      show_all_projects_on_home: true,
      banner_title: 'FIRST BORN GOSPEL LIFE MINISTRIES',
      banner_subtitle: 'Transforming Lives through Social, Economic & Educational Empowerment in Christ'
    });
    await settings.save();

    // 3. Insert State Districts
    console.log('Seeding state districts...');
    const region1 = await new StateDistrict({ state: 'AP', district: 'EG' }).save(); // Andhra Pradesh - East Godavari
    const region2 = await new StateDistrict({ state: 'KA', district: 'BLR' }).save(); // Karnataka - Bangalore
    const region3 = await new StateDistrict({ state: 'TS', district: 'HYD' }).save(); // Telangana - Hyderabad

    // 4. Insert Default Admin
    console.log('Seeding admin profile...');
    const adminUid = 'mock_admin_uid'; // Used for mock auth fallback. Real login will map to Firebase UID.
    const admin = new Profile({
      _id: adminUid,
      name: 'Super Admin',
      email: 'admin@fbgl.org',
      role: 'admin',
      id_no: 'FBGL ADMIN 01',
      state: 'KA',
      district: 'BLR',
      password: defaultPassword
    });
    await admin.save();

    // 5. Insert Board Members
    console.log('Seeding board members...');
    const board1 = new Profile({
      _id: 'board_member_1_uid',
      name: 'Rev. Dr. V. K. Raju',
      role: 'board_member',
      position: 'Founder & President',
      bio: 'Rev. Dr. V. K. Raju founded FIRST BORN GOSPEL LIFE MINISTRIES in 2016 with a vision to transform lives and communities in Christ through social and economic empowerment.',
      profile_picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250',
      state: 'KA',
      district: 'BLR'
    });
    const board2 = new Profile({
      _id: 'board_member_2_uid',
      name: 'Dr. V. K. Josiah',
      role: 'board_member',
      position: 'Vice President',
      bio: 'Dr. V. K. Josiah coordinates international partner relationships and helps direct our community outreach and education initiatives.',
      profile_picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250',
      state: 'KA',
      district: 'BLR'
    });
    await Promise.all([board1.save(), board2.save()]);

    // 6. Insert Area Manager (Andhra Pradesh - East Godavari)
    console.log('Seeding area manager...');
    const areaManager = new Profile({
      _id: 'area_manager_uid',
      name: 'K. Satish Kumar',
      email: 'area_manager@fbgl.org',
      role: 'area_manager',
      id_no: 'FBGL AP EG A01',
      state: 'AP',
      district: 'EG',
      phone: '+91 9876543210',
      address: 'Rajamahendravaram, East Godavari, Andhra Pradesh',
      bio: 'K. Satish Kumar oversees all community operations and projects in the East Godavari region.',
      password: defaultPassword
    });
    await areaManager.save();

    // 7. Insert Project Manager (under Area Manager)
    console.log('Seeding project manager...');
    const projectManager = new Profile({
      _id: 'project_manager_uid',
      name: 'M. Prasad Rao',
      email: 'project_manager@fbgl.org',
      role: 'project_manager',
      id_no: 'FBGL AP EG P01',
      state: 'AP',
      district: 'EG',
      phone: '+91 8765432109',
      address: 'Kakinada, East Godavari, Andhra Pradesh',
      bio: 'M. Prasad Rao manages field projects, including feeding programs and training centers.',
      area_manager_id: areaManager._id,
      password: defaultPassword
    });
    await projectManager.save();

    // 8. Insert Social Worker (under Project Manager)
    console.log('Seeding social worker...');
    const socialWorker = new Profile({
      _id: 'social_worker_uid',
      name: 'D. Krupa Paul',
      email: 'social_worker@fbgl.org',
      role: 'social_worker',
      id_no: 'FBGL AP EG S01',
      state: 'AP',
      district: 'EG',
      phone: '+91 7654321098',
      address: 'Mandapeta, East Godavari, Andhra Pradesh',
      bio: 'D. Krupa Paul works directly with beneficiaries in villages, running feeding schedules.',
      project_manager_id: projectManager._id,
      password: defaultPassword
    });
    await socialWorker.save();

    // 9. Insert Projects
    console.log('Seeding projects...');
    const project1 = new Project({
      title: 'Hope Center Feeding Initiative',
      description: 'Providing nutritious meals daily to over 150 children and elders in marginalized rural villages. This project operates through our Kakinada Hope Center to fight malnutrition and support families.',
      category: 'social',
      status: 'ongoing',
      location: 'Kakinada, Andhra Pradesh',
      area_of_operation: 'East Godavari Rural',
      target_beneficiaries: 'Underprivileged Children and Elders',
      project_manager_id: projectManager._id,
      social_worker_id: socialWorker._id,
      images: [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600',
        'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=600'
      ],
      show_on_home: true
    });

    const project2 = new Project({
      title: 'Sewing & Tailoring Vocational Training',
      description: 'Empowering local women through certified sewing and tailoring courses. Each graduate is gifted a sewing machine to start their own micro-business, securing financial independence.',
      category: 'economy',
      status: 'ongoing',
      location: 'Rajamahendravaram, Andhra Pradesh',
      area_of_operation: 'East Godavari urban/slums',
      target_beneficiaries: 'Widows and Single Mothers',
      project_manager_id: projectManager._id,
      images: [
        'https://images.unsplash.com/photo-1520263115673-610416f52ab6?q=80&w=600'
      ],
      show_on_home: true
    });

    const project3 = new Project({
      title: 'Rural Borewell & Clean Water Initiative',
      description: 'Drilled and installed a deep borewell fitted with a clean water filtration system in an arid village, providing over 400 residents with fresh drinking water, reducing water-borne diseases.',
      category: 'social',
      status: 'completed',
      location: 'Mandapeta Village, Andhra Pradesh',
      area_of_operation: 'East Godavari Interior',
      target_beneficiaries: 'Rural Village Residents',
      project_manager_id: projectManager._id,
      social_worker_id: socialWorker._id,
      images: [
        'https://images.unsplash.com/photo-1541913496-8099cd5353ed?q=80&w=600'
      ],
      show_on_home: false
    });

    await Promise.all([project1.save(), project2.save(), project3.save()]);

    // 10. Insert Blog Posts
    console.log('Seeding blog posts...');
    const blog1 = new BlogPost({
      title: 'Inauguration of Kakinada Hope Center',
      content: 'We are thrilled to announce the opening of our newest Hope Center in Kakinada, East Godavari! The center will serve as a hub for our community feeding program, clean water distribution, and children\'s evening tutoring classes. Rev. Dr. V. K. Raju officiated the opening, and we shared a delicious meal with over 200 local residents. Thank you to our partners for making this possible.',
      author_id: admin._id,
      author_name: admin.name,
      published: true,
      cover_image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800'
    });

    const blog2 = new BlogPost({
      title: 'Free Health Checkup Camp Benefits 350+ People',
      content: 'In collaboration with local medical volunteers, FBGL Ministries conducted a free medical camp in Mandapeta. We provided free consultations, health checkups, blood sugar screenings, and essential medicines to underserved families. Many children and elders who lack access to regular healthcare were treated. We plan to host these camps quarterly to support community wellbeing.',
      author_id: admin._id,
      author_name: admin.name,
      published: true,
      cover_image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800'
    });

    await Promise.all([blog1.save(), blog2.save()]);

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedDatabase();
