import fs from "node:fs";
import multer from "multer";
import path from "node:path";
import { PROFILES_DIR, ensureStorageDirs } from "../utils/storage.js";

ensureStorageDirs();

const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, PNG, JPG, and JPEG files are allowed!"), false);
  }
}

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PROFILES_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `profile-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`,
    );
  },
});

export const profileUpload = multer({
  storage: profileStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Profile pictures must be PNG, JPG, or JPEG."), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const applicationUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
