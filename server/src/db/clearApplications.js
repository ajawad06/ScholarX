import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { connectDatabase } from "./connect.js";
import { Counter } from "../models/Counter.js";
import { ExchangeApplication } from "../models/ExchangeApplication.js";
import { ScholarshipApplication } from "../models/ScholarshipApplication.js";
import {
  APPLICATIONS_DIR,
  collectApplicationUploadPaths,
  deleteApplicationDirectory,
  deleteStorageFiles,
} from "../utils/storage.js";

dotenv.config();

export async function clearApplicationData() {
  const [exchangeApps, scholarshipApps] = await Promise.all([
    ExchangeApplication.find({}),
    ScholarshipApplication.find({}),
  ]);

  const uploadFiles = collectApplicationUploadPaths([
    ...exchangeApps,
    ...scholarshipApps,
  ]);
  deleteStorageFiles(uploadFiles);

  for (const app of exchangeApps) {
    deleteApplicationDirectory("exchange", app.id);
  }
  for (const app of scholarshipApps) {
    deleteApplicationDirectory("scholarship", app.id);
  }

  if (fs.existsSync(APPLICATIONS_DIR)) {
    fs.rmSync(APPLICATIONS_DIR, { recursive: true, force: true });
  }

  const [exchangeResult, scholarshipResult] = await Promise.all([
    ExchangeApplication.deleteMany({}),
    ScholarshipApplication.deleteMany({}),
  ]);

  await Promise.all([
    Counter.updateOne(
      { name: "exchangeApplications" },
      { $set: { value: 0 } },
      { upsert: true },
    ),
    Counter.updateOne(
      { name: "scholarshipApplications" },
      { $set: { value: 0 } },
      { upsert: true },
    ),
  ]);

  return {
    exchangeDeleted: exchangeResult.deletedCount,
    scholarshipDeleted: scholarshipResult.deletedCount,
    uploadsDeleted: uploadFiles.size,
  };
}

async function main() {
  await connectDatabase();
  const result = await clearApplicationData();
  console.log(
    `Cleared ${result.exchangeDeleted} exchange and ${result.scholarshipDeleted} scholarship application(s).`,
  );
  if (result.uploadsDeleted > 0) {
    console.log(`Removed ${result.uploadsDeleted} stored document(s).`);
  }
  process.exit(0);
}

const isDirectRun =
  process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((error) => {
    console.error("Failed to clear applications:", error.message);
    process.exit(1);
  });
}
