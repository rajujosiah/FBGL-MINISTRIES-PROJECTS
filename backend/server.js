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

// Database Connection (MongoDB) with Serverless Connection Caching
const mongoURI = process.env.MONGODB_URI || 'mongodb://fbglministries2016_db_user:LuyNgH2gPY7fuOi9@ac-sysletb-shard-00-00.zw4qyzh.mongodb.net:27017,ac-sysletb-shard-00-01.zw4qyzh.mongodb.net:27017,ac-sysletb-shard-00-02.zw4qyzh.mongodb.net:27017/fbgl?ssl=true&replicaSet=atlas-zl7r5s-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    cached.promise = mongoose.connect(mongoURI, opts).then((m) => {
      console.log('💾 MongoDB Connected Successfully to Atlas Cloud');
      return m;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

// Middleware to ensure DB connection & set caching headers for GET requests
app.use(async (req, res, next) => {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  }
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('❌ MongoDB Connection error:', err.message);
    next();
  }
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

// Start Server (only if not running on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}

// Export for Vercel Serverless Functions
module.exports = app;
