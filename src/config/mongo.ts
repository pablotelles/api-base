import mongoose from 'mongoose';
import { getEnv } from './env.js';
import chalk from 'chalk';
import logSymbols from 'log-symbols';

let isConnected = false;

export async function connectMongo() {
  const mongoUri = getEnv('MONGO_URI');

  console.log(
    `${logSymbols.info} ${chalk.cyan('[mongo]')} connecting to ${chalk.gray(mongoUri)}...`,
  );

  try {
    await mongoose.connect(mongoUri, {});
    wireConnectionEvents();
    isConnected = true;

    console.log(`${logSymbols.success} ${chalk.green('[mongo] connected successfully')}`);
    return mongoose.connection;
  } catch (err) {
    console.error(`${logSymbols.error} ${chalk.red('[mongo] connection failed:')}`, err);
    throw err;
  }
}

function wireConnectionEvents() {
  const conn = mongoose.connection;

  conn.on('connected', () => {
    console.log(
      `${logSymbols.success} ${chalk.green('[mongo] connected to DB:')} ${chalk.yellow(conn.name)}`,
    );
  });

  conn.on('error', (err) => {
    console.error(`${logSymbols.error} ${chalk.red('[mongo] error:')}`, err);
  });

  conn.on('disconnected', () => {
    console.warn(`${logSymbols.warning} ${chalk.yellow('[mongo] disconnected')}`);
  });
}

export async function disconnectMongo() {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
  console.log(`${logSymbols.info} ${chalk.gray('[mongo] connection closed')}`);
}
