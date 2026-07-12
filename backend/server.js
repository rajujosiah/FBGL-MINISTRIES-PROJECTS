require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


// Express App Initialization
const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: '*', // Allow all origins for Flutter Web compatibility
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads locally (fallback)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Database Connection (MongoDB)
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://fbglministries2016_db_user:LuyNgH2gPY7fuOi9@cluster0.zw4qyzh.mongodb.net/?appName=Cluster0';
const localMongoURI = 'mongodb://127.0.0.1:27017/fbgl';

mongoose.connect(mongoURI)
  .then(() => console.log('💾 MongoDB Connected Successfully to Atlas Cloud'))
  .catch(err => {
    console.error('❌ MongoDB Atlas connection error:', err.message);
    console.log('🔄 Attempting to connect to local MongoDB (mongodb://127.0.0.1:27017/fbgl)...');
    
    mongoose.connect(localMongoURI)
      .then(() => console.log('💾 MongoDB Connected Successfully to Local Instance'))
      .catch(localErr => {
        console.error('❌ Local MongoDB connection error:', localErr.message);
        console.log('⚠️ Running in OFFLINE/DEMO mode. DB operations will fail until MongoDB is started or configured.');
      });
  });

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/state-districts', require('./routes/state-districts'));

// Base Route
app.get('/', (req, res) => {
  res.json({
    name: 'FBGL Ministries Backend API',
    status: 'Running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong on the server!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
