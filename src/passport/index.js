const passport = require("passport");
const passportJWT = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require("jsonwebtoken");
const User = require("../models/Auth");
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies.token,
        (req) => req.cookies.accessToken,
      ]),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done("jwt expired");
      }

      return done(null, jwtPayload);
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3000/user/googleRedirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        username: profile.emails[0].value,
        role: "user",
      };

      try {
        const user = await User.findOne({ where: { googleid: profile.id } });
        if (user) {
          const tokens = await authenticate(user);
          done(null, { user, tokens });
        } else {
          await User.create(user);
          const tokens = await authenticate(user);
          done(null, { user, tokens });
        }
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
