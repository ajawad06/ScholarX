import bcrypt from "bcryptjs";
import { Router } from "express";
import { Program } from "../models/Program.js";
import { Scholarship } from "../models/Scholarship.js";
import { Student } from "../models/Student.js";
import { Instructor } from "../models/Instructor.js";
import { University } from "../models/University.js";
import { ExchangeApplication } from "../models/ExchangeApplication.js";
import { ScholarshipApplication } from "../models/ScholarshipApplication.js";
import {
  getNextSequenceValue,
  formatPublicStudent,
  formatPublicInstructor,
} from "../utils/helpers.js";
import { asyncRoute } from "../utils/asyncRoute.js";
import { requireAuth } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth("admin"));

adminRouter.get(
  "/overview",
  asyncRoute(async (req, res) => {
    const [programs, scholarships, students, instructors, universities] =
      await Promise.all([
        Program.find(),
        Scholarship.find(),
        Student.find(),
        Instructor.find(),
        University.find(),
      ]);

    const formattedStudents = await Promise.all(
      students.map(formatPublicStudent),
    );
    const formattedInstructors = instructors.map(formatPublicInstructor);

    res.json({
      programs,
      scholarships,
      students: formattedStudents,
      instructors: formattedInstructors,
      universities,
    });
  }),
);

adminRouter.post(
  "/programs",
  asyncRoute(async (req, res) => {
    const id = await getNextSequenceValue("programs");
    const program = await Program.create({
      id,
      name: req.body.name,
      duration: req.body.duration,
      requirements: req.body.requirements,
      startDate: req.body.startDate,
      universityId: Number(req.body.universityId),
    });
    res.status(201).json({ program });
  }),
);

adminRouter.delete(
  "/programs/:id",
  asyncRoute(async (req, res) => {
    await Program.deleteOne({ id: Number(req.params.id) });
    res.status(204).end();
  }),
);

adminRouter.post(
  "/scholarships",
  asyncRoute(async (req, res) => {
    const id = await getNextSequenceValue("scholarships");
    const scholarship = await Scholarship.create({
      id,
      name: req.body.name,
      description: req.body.description,
      criteria: req.body.criteria,
      fundingOrganization: req.body.fundingOrganization,
      coverage: req.body.coverage,
      amount: Number(req.body.amount || 0),
      deadline: req.body.deadline,
    });
    res.status(201).json({ scholarship });
  }),
);

adminRouter.delete(
  "/scholarships/:id",
  asyncRoute(async (req, res) => {
    await Scholarship.deleteOne({ id: Number(req.params.id) });
    res.status(204).end();
  }),
);

adminRouter.post(
  "/students",
  asyncRoute(async (req, res) => {
    const id = await getNextSequenceValue("students");
    const student = await Student.create({
      id,
      name: req.body.name,
      email: String(req.body.email || "").toLowerCase(),
      dob: req.body.dob,
      nationality: req.body.nationality,
      contact: req.body.contact,
      universityId: Number(req.body.universityId),
      gpa: Number(req.body.gpa),
      password: await bcrypt.hash(req.body.password || "student123", 10),
      profilePic: null,
    });
    const formattedStudent = await formatPublicStudent(student);
    res.status(201).json({ student: formattedStudent });
  }),
);

adminRouter.delete(
  "/students/:id",
  asyncRoute(async (req, res) => {
    const studentId = Number(req.params.id);
    await Promise.all([
      Student.deleteOne({ id: studentId }),
      ExchangeApplication.deleteMany({ studentId: studentId }),
      ScholarshipApplication.deleteMany({ studentId: studentId }),
    ]);
    res.status(204).end();
  }),
);

adminRouter.post(
  "/instructors",
  asyncRoute(async (req, res) => {
    const id = await getNextSequenceValue("instructors");
    const instructor = await Instructor.create({
      id,
      universityId: 1, // Fixed to NUST (id: 1)
      fname: req.body.fname,
      mname: req.body.mname,
      lname: req.body.lname,
      email: String(req.body.email || "").toLowerCase(),
      contact: req.body.contact,
      department: req.body.department,
      password: await bcrypt.hash(req.body.password || "instructor123", 10),
      profilePic: null,
    });
    res.status(201).json({ instructor: formatPublicInstructor(instructor) });
  }),
);

adminRouter.post(
  "/universities",
  asyncRoute(async (req, res) => {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "University name is required." });
    }

    try {
      const response = await fetch(
        `http://universities.hipolabs.com/search?name=${encodeURIComponent(name.trim())}`,
      );
      const matches = await response.json();

      if (!matches || matches.length === 0) {
        return res.status(400).json({
          message: `University "${name}" could not be verified. Please check spelling.`,
        });
      }

      const bestMatch = matches[0];

      const existing = await University.findOne({
        name: {
          $regex: new RegExp(
            `^${bestMatch.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}$`,
            "i",
          ),
        },
      });
      if (existing) {
        return res.status(409).json({
          message: `University "${bestMatch.name}" is already registered.`,
        });
      }

      const id = await getNextSequenceValue("universities");
      const university = await University.create({
        id,
        name: bestMatch.name,
        country: bestMatch.country || "Unknown",
        city: bestMatch["state-province"] || "Unknown",
        address: bestMatch.web_pages?.[0] || "Unknown",
      });

      res.status(201).json({ university });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to verify university: " + error.message });
    }
  }),
);
