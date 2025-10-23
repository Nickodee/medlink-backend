const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // In development, continue without database connection for testing
    if (process.env.NODE_ENV !== 'production') {
      console.log('Continuing without database connection in development mode...');
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
