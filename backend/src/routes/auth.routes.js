import {Router} from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  generateAccessAndRefereshTokens,
  googleAuthCallback,
  authenticatedUser,
} from '../controllers/auth.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {checkFileExists} from '../middlewares/checkFileExist.middleware.js';
import passport from 'passport';
import {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.model.js';

const router = Router();

// tested
router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
  ]),
  checkFileExists, // Middleware to check for file presence
  registerUser
);

router.route('/login').post(loginUser); // tested

//secured routes
router.route('/logout').post(verifyJWT, logoutUser); // tested
router.route('/refresh-token').post(refreshAccessToken); // tested

router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').post(resetPassword);

router.route('/verifyMe').get(verifyJWT, authenticatedUser);

// ---------- google authentication------
// Google Auth Route

router.get(
  '/google',
  (req, res, next) => {
    console.log('Google Auth Route Reached');
    next();
  },
  // passport.authenticate('google', {session: false, scope: ['profile', 'email']})
  passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Google Callback Route Reached');
    next();
  },

  passport.authenticate('google', {
    session: false,
    // failureRedirect: `${process.env.FRONTEND_URL}/login`,
    failureRedirect: `/login`,
  }),
  googleAuthCallback //on succussfull G-authentication this function will run
);

export default router;
