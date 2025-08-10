import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from '@infra/http/routes';
import { connectMongo, disconnectMongo } from '@config/mongo';
import { getEnv } from '@config/env';
import { errorHandler } from './infra/middleware/errorHandleMidleware';
import chalk from 'chalk';
import logSymbols from 'log-symbols';

async function createApp() {
  const PORT = getEnv('PORT');
  const NODE_ENV = getEnv('NODE_ENV');

  await connectMongo();

  const app = express();

  app.disable('x-powered-by');
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.use('/api', router);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
  });

  // H. Error handler global
  app.use(errorHandler);

  console.log(
    `${logSymbols.success} ${chalk.bold.green('[API]')} ${chalk.green('running')} at ${chalk.cyan(
      `http://localhost:${PORT}`,
    )} ${chalk.gray(`(${NODE_ENV})`)}`,
  );

  function shutdown(signal: string) {
    console.log(`[api] ${signal} received. Closing...`);

    server.close(async () => {
      try {
        await disconnectMongo();

        console.log('[api] closed cleanly. Bye!');
        process.exit(0);
      } catch (e) {
        console.error('[api] error on shutdown', e);
        process.exit(1);
      }
    });

    setTimeout(() => {
      console.warn('[api] force exit after timeout');
      process.exit(1);
    }, 10_000).unref();
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

createApp().catch((err) => {
  console.error('[api] fatal startup error:', err);
  process.exit(1);
});
