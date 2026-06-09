import fs from "node:fs";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Student } from "../models/Student.js";
import { Instructor } from "../models/Instructor.js";
import {
  contentTypeForPath,
  resolveStoragePath,
} from "../utils/storage.js";
import { asyncRoute } from "../utils/asyncRoute.js";

export const mediaRouter = Router();

mediaRouter.get(
  "/profile",
  requireAuth(),
  asyncRoute(async (req, res) => {
    const relativePath = String(req.query.path || "");
    if (!relativePath.startsWith("profiles/")) {
      return res.status(400).json({ message: "Invalid profile path." });
    }

    const owner =
      req.user.role === "student"
        ? await Student.findOne({ id: req.user.id, profilePic: relativePath })
        : req.user.role === "instructor"
          ? await Instructor.findOne({ id: req.user.id, profilePic: relativePath })
          : null;

    if (!owner) {
      return res.status(403).json({ message: "You do not have access to this file." });
    }

    const absolutePath = resolveStoragePath(relativePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found." });
    }

    res.setHeader("Content-Type", contentTypeForPath(relativePath));
    res.sendFile(absolutePath);
  }),
);
