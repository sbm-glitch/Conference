// import express from 'express'
// const app = express()
// app.use(express.json({
//     limit: '16kb'
// }))
// app.use(express.urlencoded({
//     extended: true,
//     limit: '50kb'
//     // limit: '16kb' this is done by youtube
// }))
// export default app



import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import {
    securityMiddlewares,
    limiter
} from './middlewares/security.middleware.js';
import routes from '../src/routes/index.js'
import registrationRoutes  from '../src/routes/registration.routes.js'
import groupRegistrationRoutes from '../src/routes/groupRegistration.routes.js'

const app = express();

// Security Middlewares (Apply FIRST)
app.use(securityMiddlewares.helmet);
app.use(securityMiddlewares.cors);

// Rate limiting
app.use(limiter);

// Body parsers
app.use(express.json({
    limit: '16kb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}));

// HPP protection
app.use(securityMiddlewares.hpp);

// Cookie parser
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Trust proxy
app.set('trust proxy', 1);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running smoothly!'
    });
});

app.use('/api/v1', routes);
app.use('/api/v1',registrationRoutes)
app.use('/api/v1',groupRegistrationRoutes )

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

export default app;