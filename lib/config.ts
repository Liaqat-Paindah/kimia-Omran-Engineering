import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://ayandah644_db_user:OXSX9snOLcfEyere@ayandahdb.0n9izsv.mongodb.net/?appName=AyandahDB";

const clientOptions = {
  serverApi: {
    version: "1" as const,
    strict: true,
    deprecationErrors: true,
  },
};

// Define the cache type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global type
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize cached connection with proper typing
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

export async function ConnectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, clientOptions)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    try {
      await mongoose.connection.db?.admin().command({ ping: 1 });
      console.log(
        " Pinged your deployment. You successfully connected to MongoDB!",
      );
    } catch (pingError) {
      console.warn(pingError);
    }
  } catch {
    cached.promise = null;
    throw new Error("Database connection failed");
  }

  return cached.conn;
}
