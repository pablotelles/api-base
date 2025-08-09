import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { connectMongo, disconnectMongo } from '@config/mongo';
import { getEnv } from '@config/env';

async function main() {
  const PORT = getEnv('PORT');
  const NODE_ENV = getEnv('NODE_ENV');

  await connectMongo();

  const app = express();

  app.disable('x-powered-by');
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, env: NODE_ENV });
  });

  //Rotas de negócio (fina camada HTTP)

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
  });

  // H. Error handler global (sempre por último)

  const server = app.listen(PORT, () => {
    console.log(`[api] up on :${PORT} (${NODE_ENV})`);
  });

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

main().catch((err) => {
  console.error('[api] fatal startup error:', err);
  process.exit(1);
});
