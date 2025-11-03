// config/db.js
import mongoose from 'mongoose'; // Changed require to import

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not configured');
  // Removed deprecated options (useNewUrlParser, useUnifiedTopology) which are default in modern Mongoose
  await mongoose.connect(uri);
  console.log('MongoDB connected (via connectDB function)');
};

export default{ connectDB }; // Changed module.exports to export