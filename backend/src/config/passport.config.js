import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {User} from '../models/user.model.js';
import dotenv from 'dotenv';
import {generateAccessAndRefereshTokens} from '../controllers/auth.controller.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`, // Must match Google console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({email: profile._json.email});

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile._json.email,
            password: Date.now(),
            avatar: profile.photos[0].value,
            phoneNumber: profile.id,
          });
          console.log('user created successfully:');
        }

        const {accessToken, refreshToken} =
          await generateAccessAndRefereshTokens(user._id);

        return done(null, {user, accessToken, refreshToken});

        // return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => {
  done(null, user);
});
