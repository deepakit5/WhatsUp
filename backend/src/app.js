import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import session from 'express-session';
import passport from 'passport';
import './config/passport.config.js';
// import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, //to make fronted and backend connection easier
  })
);

app.use(express.json({limit: '16kb'})); //to parse incoming JSON data in the request body.
app.use(express.urlencoded({extended: true, limit: '16kb'}));

app.use(cookieParser()); //parses cookies from the incoming request

// middlewares for google authentications
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
app.use(passport.initialize());
// app.use(passport.session());

// Routes
// app.use('/auth', authRoutes);

//routes import
import allRoutes from './routes/index.routes.js';
import {errorHandler} from './middlewares/errorHandler.middleware.js';

//routes declaration
app.use('/api/v1', allRoutes);

// Catch-all for undefined routes (optional)
app.use((req, res, next) => {
  // console.error(`Route Not Found: ${req.method} ${req.originalUrl}`); // Log the missing route
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler middleware (placed after all routes)
app.use(errorHandler);

export {app};
