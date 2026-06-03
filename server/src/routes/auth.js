import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { signToken } from '../middleware/auth.js';
import { Student } from '../models/Student.js';
import { Instructor } from '../models/Instructor.js';
import { Admin } from '../models/Admin.js';
import { formatPublicStudent, formatPublicInstructor, formatPublicAdmin } from '../utils/helpers.js';
import { asyncRoute } from '../utils/asyncRoute.js';

export const authRouter = Router();

authRouter.post('/student/login', asyncRoute(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const student = await Student.findOne({ email });

  if (!student || !(await bcrypt.compare(req.body.password || '', student.password))) {
    return res.status(401).json({ message: 'Invalid student email or password.' });
  }

  const user = { id: student.id, role: 'student', universityId: student.universityId };
  const formattedStudent = await formatPublicStudent(student);
  res.json({ token: signToken(user), user: formattedStudent });
}));

authRouter.post('/instructor/login', asyncRoute(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const instructor = await Instructor.findOne({ email });

  if (!instructor || !(await bcrypt.compare(req.body.password || '', instructor.password))) {
    return res.status(401).json({ message: 'Invalid instructor email or password.' });
  }

  const user = { id: instructor.id, role: 'instructor', universityId: instructor.universityId };
  res.json({ token: signToken(user), user: formatPublicInstructor(instructor) });
}));

authRouter.post('/admin/login', asyncRoute(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const admin = await Admin.findOne({ email });

  if (!admin || !(await bcrypt.compare(req.body.password || '', admin.password))) {
    return res.status(401).json({ message: 'Invalid admin email or password.' });
  }

  const user = { id: admin.id, role: 'admin' };
  res.json({ token: signToken(user), user: formatPublicAdmin(admin) });
}));
