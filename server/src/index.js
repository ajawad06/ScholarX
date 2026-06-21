import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { apiRouter } from './routes/index.js';
import { connectDatabase } from './db/connect.js';
import { seedDatabase } from './db/seed.js';
import { ensureStorageDirs } from './utils/storage.js';
import { purgeExpiredOpportunities } from './utils/purgeExpired.js';
import { errorHandler, notFound } from './middleware/errors.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, '../../public/uploads');

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));
app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  ensureStorageDirs();
  await connectDatabase();
  await seedDatabase();

  // Remove already-expired programs/scholarships on boot, then re-check daily
  // so long-running instances stay clean even without traffic.
  await purgeExpiredOpportunities();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  setInterval(() => {
    purgeExpiredOpportunities().catch((error) =>
      console.error('Scheduled purge failed:', error.message)
    );
  }, ONE_DAY).unref();

  app.listen(port, () => {
    console.log(`ScholarX API running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start ScholarX API:', error.message);
  process.exit(1);
});
