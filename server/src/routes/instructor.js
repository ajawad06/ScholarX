import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { ExchangeApplication } from '../models/ExchangeApplication.js';
import { ScholarshipApplication } from '../models/ScholarshipApplication.js';
import { Student } from '../models/Student.js';
import { Instructor } from '../models/Instructor.js';
import { Program } from '../models/Program.js';
import { Scholarship } from '../models/Scholarship.js';
import { University } from '../models/University.js';
import { asyncRoute } from '../utils/asyncRoute.js';

export const instructorRouter = Router();

instructorRouter.get('/applications', requireAuth('instructor'), asyncRoute(async (req, res) => {
  const term = String(req.query.search || '').trim().toLowerCase();
  
  const [exchangeApps, scholarshipApps] = await Promise.all([
    ExchangeApplication.find({ status: 'Pending' }),
    ScholarshipApplication.find({ status: 'Pending' })
  ]);

  const mappedExchangeApps = await Promise.all(
    exchangeApps.map(async (app) => {
      const student = await Student.findOne({ id: app.studentId });
      const program = await Program.findOne({ id: app.programId });
      const university = student ? await University.findOne({ id: student.universityId }) : null;

      return {
        ...app.toObject(),
        studentName: student?.name || 'Unknown',
        gpa: student?.gpa || 0,
        university: university?.name || 'Unknown',
        programName: program?.name || 'Unknown'
      };
    })
  );

  const filteredExchangeApps = mappedExchangeApps.filter((app) => {
    if (!term) return true;
    return (
      app.studentName.toLowerCase().includes(term) ||
      app.programName.toLowerCase().includes(term)
    );
  });

  const mappedScholarshipApps = await Promise.all(
    scholarshipApps.map(async (app) => {
      const student = await Student.findOne({ id: app.studentId });
      const scholarship = await Scholarship.findOne({ id: app.scholarshipId });
      const university = student ? await University.findOne({ id: student.universityId }) : null;

      return {
        ...app.toObject(),
        studentName: student?.name || 'Unknown',
        gpa: student?.gpa || 0,
        university: university?.name || 'Unknown',
        scholarshipName: scholarship?.name || 'Unknown'
      };
    })
  );

  const filteredScholarshipApps = mappedScholarshipApps.filter((app) => {
    if (!term) return true;
    return (
      app.studentName.toLowerCase().includes(term) ||
      app.scholarshipName.toLowerCase().includes(term)
    );
  });

  res.json({
    exchangeApplications: filteredExchangeApps,
    scholarshipApplications: filteredScholarshipApps
  });
}));

instructorRouter.patch('/applications/:type/:id', requireAuth('instructor'), asyncRoute(async (req, res) => {
  const { type, id } = req.params;
  if (!['exchange', 'scholarship'].includes(type)) {
    return res.status(400).json({ message: 'Application type must be exchange or scholarship.' });
  }

  const action = req.body.action;
  if (!['Approved', 'Rejected'].includes(action)) {
    return res.status(400).json({ message: 'Action must be Approved or Rejected.' });
  }

  const model = type === 'exchange' ? ExchangeApplication : ScholarshipApplication;
  const application = await model.findOne({ id: Number(id) });
  if (!application) {
    return res.status(404).json({ message: 'Application not found.' });
  }

  application.status = action;
  application.approvalDate = new Date().toISOString().slice(0, 10);
  await application.save();

  res.json({ application });
}));

instructorRouter.post('/me/profile-pic', requireAuth('instructor'), upload.single('profilePic'), asyncRoute(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  const instructor = await Instructor.findOne({ id: req.user.id });
  if (!instructor) return res.status(404).json({ message: 'Instructor not found.' });

  instructor.profilePic = `/uploads/${req.file.filename}`;
  await instructor.save();

  res.json({ message: 'Profile picture updated successfully.', profilePic: instructor.profilePic });
}));
