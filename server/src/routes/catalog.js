import { Router } from 'express';
import { Program } from '../models/Program.js';
import { Scholarship } from '../models/Scholarship.js';
import { University } from '../models/University.js';
import { asyncRoute } from '../utils/asyncRoute.js';

export const catalogRouter = Router();

catalogRouter.get('/', asyncRoute(async (req, res) => {
  const [programs, scholarships, universities] = await Promise.all([
    Program.find(),
    Scholarship.find(),
    University.find()
  ]);

  res.json({
    programs,
    scholarships,
    universities
  });
}));
