import { Router } from 'express';
import { adminRouter } from './admin.js';
import { authRouter } from './auth.js';
import { catalogRouter } from './catalog.js';
import { instructorRouter } from './instructor.js';
import { mediaRouter } from './media.js';
import { studentRouter } from './student.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => res.json({ status: 'ok' }));
apiRouter.use('/auth', authRouter);
apiRouter.use('/catalog', catalogRouter);
apiRouter.use('/students', studentRouter);
apiRouter.use('/instructors', instructorRouter);
apiRouter.use('/media', mediaRouter);
apiRouter.use('/admin', adminRouter);
