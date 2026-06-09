import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const STORAGE_ROOT = path.resolve(__dirname, "../../storage");
export const PROFILES_DIR = path.join(STORAGE_ROOT, "profiles");
export const APPLICATIONS_DIR = path.join(STORAGE_ROOT, "applications");

const APPLICATION_FIELDS = [
  "studentIdCard",
  "personalStatement",
  "transcript",
  "recommendationLetter",
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function ensureStorageDirs() {
  ensureDir(PROFILES_DIR);
  ensureDir(APPLICATIONS_DIR);
}

export function resolveStoragePath(relativePath) {
  const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const absolutePath = path.resolve(STORAGE_ROOT, normalized);
  if (!absolutePath.startsWith(STORAGE_ROOT)) {
    throw new Error("Invalid storage path.");
  }
  return absolutePath;
}

export function saveApplicationDocuments(type, applicationId, files) {
  const dir = path.join(APPLICATIONS_DIR, type, String(applicationId));
  ensureDir(dir);

  const saved = {};
  for (const [field, fileList] of Object.entries(files)) {
    const file = fileList?.[0];
    if (!file) continue;

    const ext = path.extname(file.originalname).toLowerCase() || ".pdf";
    const filename = `${field}${ext}`;
    const relativePath = path.join("applications", type, String(applicationId), filename);
    fs.writeFileSync(resolveStoragePath(relativePath), file.buffer);
    saved[field] = relativePath.replace(/\\/g, "/");
  }

  return saved;
}

export function collectApplicationUploadPaths(applications) {
  const paths = new Set();
  for (const app of applications) {
    for (const field of APPLICATION_FIELDS) {
      const value = app[field];
      if (typeof value === "string" && value.startsWith("applications/")) {
        paths.add(value);
      }
    }
  }
  return paths;
}

export function deleteStorageFiles(relativePaths) {
  for (const relativePath of relativePaths) {
    const filePath = resolveStoragePath(relativePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export function deleteApplicationDirectory(type, applicationId) {
  const dir = path.join(APPLICATIONS_DIR, type, String(applicationId));
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function contentTypeForPath(relativePath) {
  const ext = path.extname(relativePath).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}
