import express from 'express';
import {
  individualRegistration,
  getRegistrationById,
} from '../controllers/registration.controller.js';
import { registrationLimiter } from '../middlewares/security.middleware.js';

const router = express.Router();

// Individual Registration Route
router.post('/register', registrationLimiter, individualRegistration);

// Get Individual Registration by ID
router.get('/:id', getRegistrationById);

export default router;