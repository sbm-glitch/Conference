import express from 'express';
import {
  groupRegistration,
  getGroupRegistrationById,
} from '../controllers/groupRegistration.controller.js';
import { registrationLimiter } from '../middlewares/security.middleware.js';

const router = express.Router();

// Group Registration Route
router.post('/groupregister', registrationLimiter, groupRegistration);

// Get Group Registration by ID
router.get('/:id', getGroupRegistrationById);

export default router;