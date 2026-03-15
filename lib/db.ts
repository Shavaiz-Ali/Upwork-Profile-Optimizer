import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
    // eslint-disable-next-line no-var
    var mongooseGlobal: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

let cached = global.mongooseGlobal;

if (!cached) {
    cached = global.mongooseGlobal = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached!.conn) {
        console.log("Connected to MongoDB: Using existing connection");
        return cached!.conn;
    }

    if (!cached!.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log("Connecting to MongoDB: New connection");
        cached!.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        cached!.promise = null;
        console.error("MongoDB connection error:", e);
        throw e;
    }

    return cached!.conn;
}

export default connectToDatabase;
