import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: Cached | undefined;
}

let cached: Cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error: unknown) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB; 