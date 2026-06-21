import { Router } from 'express';
import { Program } from '../models/Program.js';
import { Scholarship } from '../models/Scholarship.js';
import { University } from '../models/University.js';
import { asyncRoute } from '../utils/asyncRoute.js';
import { purgeExpiredOpportunities, todayString } from '../utils/purgeExpired.js';

export const catalogRouter = Router();

catalogRouter.get('/', asyncRoute(async (req, res) => {
  await purgeExpiredOpportunities();

  // Only surface still-open opportunities. Expired ones are hidden from the
  // catalog and apply pages, even if kept in the database for applications
  // that instructors are still processing.
  const today = todayString();
  const [programs, scholarships, universities] = await Promise.all([
    Program.find({ startDate: { $gte: today } }),
    Scholarship.find({ deadline: { $gte: today } }),
    University.find()
  ]);

  res.json({
    programs,
    scholarships,
    universities
  });
}));
