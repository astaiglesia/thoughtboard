require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const GithubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

import path from 'path';
import helmet from 'helmet';
import passport from 'passport';
import MongoStore from 'connect-mongo';

import express, { Application, Request, Response } from 'express';

import { globalErrorHandler } from './lib_middleware/ErrorHandlers';
import verifyLoggedIn from './lib_middleware/checkLoginState';
import verifyAuthProcess from './lib_middleware/verifyAuthentication';

import api from './routes/api';
import AuthRouter from './routes/auth/auth.router';
import UserModel from './models/UserModel';


// --- OAuth: passport strategies ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: '/auth/google/callback', // [] replace with production domain endpoint
    },
    verifyAuthProcess
  )
);
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: '/auth/github/callback', 
    },
    verifyAuthProcess
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: '/auth/facebook/callback',
    },
    verifyAuthProcess
  )
);
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: '/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: true,
    },
    verifyAuthProcess
  )
);

passport.use(
  new LocalStrategy(async function verify(
    username: string,
    password: string,
    cb: any
  ): Promise<boolean> {
    const user = await UserModel.findOne({ username }).catch((err) => cb(err)); // handles errors
    if (!user) return cb(null, false, { message: 'username not found.' }); // handles db misses

    // uncomment for client passwords are transmitted encrypted
    //    - (replace password arg in compare function below)
    // const encryptedInput = await bcrypt.hash(password, 3);
    const result = await bcrypt.compare(password, user.password)
      .catch((err: any) => cb(err));

    return result
      ? cb(null, user)
      : cb(null, false, {
          message: 'incorrect username + password combination',
        });
  })
);

// Session Handling
// serializes users into and out of sessions by persisting to the mongo store
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
// deserializes the session id from the cookie and associates it with the session data persisted to  the db
passport.deserializeUser((id: string, done) => {
  // User.findById(id).then(user => {
  //   done(null, user);
  // });
  done(null, id);
});


// --- Express App ---
const app: Application = express();
app                                       // -- Middleware --
  .use(helmet())                          // res-req configuration security
  .use(
    session({
      // session config
      secret: process.env.SECRET || 'v0!7r0n-d3f3nd3r',
      secure: true,
      cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 },
      resave: false,
      rolling: true,
      saveUninitialized: false,
      store: MongoStore.create({          // persists sessions
        mongoUrl: process.env.MONGO_URI,
        autoRemove: 'interval',
        autoRemoveInterval: 60 * 24,      // purge expired sessions every 24 hrs
      }),
    })
  )
  .use(passport.initialize())             // auth handling
  .use(passport.session())                // session handling

  .use(
    cors({                                // cross origin security
      origin: 'http://localhost:3000',
    })
  )
  .use(morgan('combined'))                // request logging middleware
  .use(express.json())                    // request body parser
  .use(express.urlencoded({ extended: true })) //
  .use(express.static(path.join(__dirname, '../../public')))

  // -- Routes --
  // [] review + cleanup routing structure
  .use('/api', api)
  .use('/auth', AuthRouter)

  // -- Root Routes & Error Handling
  .get('/', (req: Request, res: Response) => {
    res.status(200).sendFile(path.join(__dirname, '../../views/index.html'));
  })
  .get('/secret', verifyLoggedIn, (req: Request, res: Response) => {
    res.status(200).send('words like violence, break the silence');
  })
  .get('/failure', (req: Request, res: Response) => {
    res.status(401).send('you have failed to log in: you have 2 more attempts');
    // [] create a log in counter and debounce after too many failed attempts
  })
  .use('*', (req: Request, res: Response) =>
    res.status(404).sendFile(path.join(__dirname, '../../views/404.html'))
  )
  .use(globalErrorHandler);


export default app;

