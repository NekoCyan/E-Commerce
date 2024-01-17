import mongoose from 'mongoose';
declare global {
	var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_NAME = process.env.MONGODB_NAME!;

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local',
	);
}

if (!MONGODB_NAME) {
	throw new Error(
		'Please define the MONGODB_NAME environment variable inside .env.local',
	);
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}
	if (!cached.promise) {
		const opts: mongoose.ConnectOptions = {
			bufferCommands: false,
			dbName: MONGODB_NAME,
		};
		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongoose) => {
				return mongoose;
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

export default dbConnect;
