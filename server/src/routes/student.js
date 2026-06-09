import bcrypt from "bcryptjs";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { applicationUpload, profileUpload } from "../middleware/upload.js";
import { saveApplicationDocuments } from "../utils/storage.js";
import { Student } from "../models/Student.js";
import { Program } from "../models/Program.js";
import { Scholarship } from "../models/Scholarship.js";
import { ExchangeApplication } from "../models/ExchangeApplication.js";
import { ScholarshipApplication } from "../models/ScholarshipApplication.js";
import { getNextSequenceValue, formatPublicStudent } from "../utils/helpers.js";
import { asyncRoute } from "../utils/asyncRoute.js";

export const studentRouter = Router();

studentRouter.post(
  "/register",
  asyncRoute(async (req, res) => {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(409)
        .json({ message: "A student with this email already exists." });
    }

    const id = await getNextSequenceValue("students");
    const student = await Student.create({
      id,
      name: req.body.name,
      email,
      dob: req.body.dob,
      nationality: req.body.nationality,
      contact: req.body.contact,
      universityId: 1, // Fixed to NUST (id: 1)
      gpa: Number(req.body.gpa),
      password: await bcrypt.hash(req.body.password || "", 10),
      profilePic: null,
    });

    const formattedStudent = await formatPublicStudent(student);
    res.status(201).json({ student: formattedStudent });
  }),
);

studentRouter.get(
  "/me/dashboard",
  requireAuth("student"),
  asyncRoute(async (req, res) => {
    const student = await Student.findOne({ id: req.user.id });
    if (!student)
      return res.status(404).json({ message: "Student not found." });

    const formattedStudent = await formatPublicStudent(student);

    const exchangeApplications = await ExchangeApplication.find({
      studentId: req.user.id,
    });
    const exchangeAppsWithProgram = await Promise.all(
      exchangeApplications.map(async (app) => {
        const program = await Program.findOne({ id: app.programId });
        return {
          ...app.toObject(),
          programName: program?.name || "Unknown",
        };
      }),
    );

    const scholarshipApplications = await ScholarshipApplication.find({
      studentId: req.user.id,
    });
    const scholarshipAppsWithScholarship = await Promise.all(
      scholarshipApplications.map(async (app) => {
        const scholarship = await Scholarship.findOne({
          id: app.scholarshipId,
        });
        return {
          ...app.toObject(),
          scholarshipName: scholarship?.name || "Unknown",
        };
      }),
    );

    res.json({
      student: formattedStudent,
      exchangeApplications: exchangeAppsWithProgram,
      scholarshipApplications: scholarshipAppsWithScholarship,
    });
  }),
);

studentRouter.post(
  "/me/exchange-applications",
  requireAuth("student"),
  applicationUpload.fields([
    { name: "studentIdCard", maxCount: 1 },
    { name: "personalStatement", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "recommendationLetter", maxCount: 1 },
  ]),
  asyncRoute(async (req, res) => {
    const program = await Program.findOne({ id: Number(req.body.programId) });
    if (!program)
      return res.status(404).json({ message: "Exchange program not found." });

    if (
      !req.files ||
      !req.files.studentIdCard ||
      !req.files.personalStatement ||
      !req.files.transcript ||
      !req.files.recommendationLetter
    ) {
      return res
        .status(400)
        .json({ message: "All required documents must be uploaded." });
    }

    const appId = await getNextSequenceValue("exchangeApplications");
    const today = new Date().toISOString().slice(0, 10);
    const documents = saveApplicationDocuments("exchange", appId, req.files);

    const application = await ExchangeApplication.create({
      id: appId,
      studentId: req.user.id,
      programId: program.id,
      status: "Pending",
      applicationDate: today,
      approvalDate: null,
      ...documents,
    });

    res.status(201).json({ application });
  }),
);

studentRouter.post(
  "/me/scholarship-applications",
  requireAuth("student"),
  applicationUpload.fields([
    { name: "studentIdCard", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
  ]),
  asyncRoute(async (req, res) => {
    const scholarship = await Scholarship.findOne({
      id: Number(req.body.scholarshipId),
    });
    if (!scholarship)
      return res.status(404).json({ message: "Scholarship not found." });

    if (!req.files || !req.files.studentIdCard || !req.files.transcript) {
      return res
        .status(400)
        .json({ message: "Student ID card and transcript are required." });
    }

    const appId = await getNextSequenceValue("scholarshipApplications");
    const today = new Date().toISOString().slice(0, 10);
    const documents = saveApplicationDocuments("scholarship", appId, req.files);

    const application = await ScholarshipApplication.create({
      id: appId,
      studentId: req.user.id,
      scholarshipId: scholarship.id,
      status: "Pending",
      applicationDate: today,
      approvalDate: null,
      ...documents,
    });

    res.status(201).json({ application });
  }),
);

studentRouter.post(
  "/me/profile-pic",
  requireAuth("student"),
  profileUpload.single("profilePic"),
  asyncRoute(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    const student = await Student.findOne({ id: req.user.id });
    if (!student)
      return res.status(404).json({ message: "Student not found." });

    student.profilePic = `profiles/${req.file.filename}`;
    await student.save();

    res.json({
      message: "Profile picture updated successfully.",
      profilePic: student.profilePic,
    });
  }),
);
