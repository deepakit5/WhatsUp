import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import chatRoutes from './chat.routes.js';
import messageRoutes from './message.routes.js';
import statusRoutes from './status.routes.js';
// import GauthRoutes from './Gauth.routes.js';

// import callRoutes from "./call.routes.js";

const router = express.Router();

// Use authentication routes
router.use('/auth', authRoutes);
// router.use('/G-auth', GauthRoutes);

// Use user-related routes, self infomation
router.use('/user', userRoutes);

// Use chat-related routes
router.use('/chat', chatRoutes);

// Use messsage-related routes
router.use('/message', messageRoutes);

// Use messsage-related routes
router.use('/status', statusRoutes);
// Use call-related routes
// router.use("/calls", callRoutes);

export default router;
