const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection options for better stability
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // In development, continue without database connection for testing
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  Continuing without database connection in development mode...');
      console.log('💡 Make sure MongoDB is running or update MONGODB_URI in .env');
    } else {
      console.error('🛑 Cannot start server without database connection in production');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
