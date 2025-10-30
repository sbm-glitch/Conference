import express from 'express';
// import registrationRoutes from './registration.routes.js';
// import groupRegistrationRoutes from './groupRegistration.routes.js';

const router = express.Router();

// Group registration routes
// router.use('/registration/group', groupRegistrationRoutes);

// Registration routes
// router.use('/registration', registrationRoutes);

// Test route
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working!',
  });
});

export default router;