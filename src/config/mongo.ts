import mongoose from 'mongoose';
import { getEnv } from './env.js';

let isConnected = false;

export async function connectMongo() {
  await mongoose.connect(getEnv('MONGO_URI'), {});
  wireConnectionEvents();
  isConnected = true;
  return mongoose.connection;
}

function wireConnectionEvents() {
  const conn = mongoose.connection;

  conn.on('connected', () => {
    console.log('[mongo] connected:', conn.name);
  });

  conn.on('error', (err) => {
    console.error('[mongo] error:', err);
  });

  conn.on('disconnected', () => {
    console.warn('[mongo] disconnected');
  });
}

export async function disconnectMongo() {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
}
