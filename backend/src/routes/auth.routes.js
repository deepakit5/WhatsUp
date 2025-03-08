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
  googleAuthenticatedUser,
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
// ----------new  google authentication 2nd approach ------
//

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

// Google Auth Callback
// router.get(
//   '/google/callback',
//   (req, res, next) => {
//     console.log('Google Callback Route Reached');
//     next();
//   },

//   passport.authenticate('google', {
//     session: false,
//     failureRedirect: `${process.env.FRONTEND_URL}/auth/login`,
//   }),
//   async (req, res) => {
//     console.log('Google Authentication Successful');

//     const {
//       accessToken,
//       refreshToken,
//       user,
//       ACCESS_TOKEN_EXPIRY,
//       REFRESH_TOKEN_EXPIRY,
//     } = req.user;

//     const loggedInUser = await User.findById(user._id).select(
//       '-password -refreshToken'
//     );
//     const options = {
//       httpOnly: true,
//       secure: true,
//     };

//     res
//       .cookie('accessToken', accessToken, options)
//       .cookie('refreshToken', refreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           {
//             user: loggedInUser,
//             accessToken,
//             refreshToken,
//           },
//           'User logged In Successfully'
//         )
//       );
//     // .redirect(`${process.env.FRONTEND_URL}`);
//   }
// );
// ------------x--------------x---------
// ------------x--------------x---------
// ------------x--------------x---------
// router.get(
//   '/google/callback',
//   passport.authenticate('google', {session: false}),
//   googleAuthCallback
// );

// ------------x--------------x---------
// ------------x--------------x---------
// ------------x--------------x---------

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Google Callback Route Reached');
    next();
  },

  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  googleAuthCallback //on succussfull G-authentication this function will run
);

router.route('/me').get(verifyJWT, googleAuthenticatedUser);

// Logout
// router.get('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) return res.status(500).send(err);
//     res.redirect(process.env.FRONTEND_URL);
//   });
// });

export default router;
