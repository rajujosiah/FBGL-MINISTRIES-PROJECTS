const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fbgl').then(async () => {
  const Profile = require('./models/Profile');
  await Profile.updateMany({ area_manager_id: { $in: ['5732eb39-571c-40e1-8f6f-7f0f7c49d540', 'mock_admin_uid'] } }, { area_manager_id: null });
  await Profile.updateMany({ project_manager_id: { $in: ['5732eb39-571c-40e1-8f6f-7f0f7c49d540', 'mock_admin_uid'] } }, { project_manager_id: null });
  console.log('Fixed DB');
  process.exit(0);
}).catch(console.error);
