import path from 'path';
import passport from 'passport';
import { Router, Request, Response, NextFunction } from 'express';

import { User } from 'lib_ts/types';
import UserModel from '../../models/UserModel';
import { processResponse } from '../../lib_utils/helpers';
import { UserUtilities } from '../users/users.controller';

const AuthRouter: Router = Router()
  .get('/login', (req: Request, res: Response) => {
    return res
      .status(200)
      .sendFile(path.join(__dirname, '../../../../views/login.html'));
  })
  .post('/login/password',
    passport.authenticate('local', { failureRedirect: '/failure' }),
    (req: Request, res: Response) => res.redirect('/')
  )
  .get('/signup', (req: Request, res: Response) => {
    return res
      .status(200)
      .sendFile(path.join(__dirname, '../../../../views/registration.html'));
  })
  .post('/signup',
    async function (req: Request, res: Response, next: NextFunction) {
      const { username, password, email }: User = req.body;
      const newUser: User = {
        ...req.body,
      };
      const processClientError = (message: string) => {
        return res.status(400).json({ error: `client-error : ${message}` });
      };

      return (
        // [] iterate error messages with greater detail; [] update tests
        !username || !password
          ? processClientError('required data not submitted')
          : !UserUtilities._isValidUsername(username)
          ? processClientError('username is invalid')
          : !UserUtilities._isValidEmail(email)
          ? processClientError('email is invalid')
          : // -- validate password format if NOT encrypted client-side (...should be)
            // : (!UserUtilities._isValidPassword(password)) ? (console.log(password), processClientError(' password is invalid'))

            ((newUser.password = await UserUtilities._encryptPassword(
              password
            )),
            UserModel.create({ ...newUser })
              .then((data) => ((res.locals.data = data), next()))
              .catch((err) => next(err)))
      );
    },
    processResponse(201)
  )
  // [] convert logout to post request from client, per passport docs
  // removes req.user and clears any logged in session
  .get('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => (err ? next(err) : res.redirect('/')));
  })


  // --- OAuth flows
  .get('/google',
    /** initiates authorization code request from google auth server
     * - server responds with 302 redirect to the auth server's login and consent prompt
     * */
    passport.authenticate('google', { scope: ['email', 'profile'] })
  )
  .get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/failure' }), // [] implement a failure dialog modal
    (req: Request, res: Response) => res.redirect('/')
  )
  .get('/github', passport.authenticate('github', { scope: ['user:email'] }))
  .get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/failure' }),
    (req: Request, res: Response) => res.redirect('/')
  )
  .get('/facebook',
    passport.authenticate('facebook', { scope: ['user:email'] })
  )
  .get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/failure' }),
    (req: Request, res: Response) => res.redirect('/')
  )
  .get('/linkedin', passport.authenticate('linkedin'))
  .get('/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/failure' }),
    (req: Request, res: Response) => res.redirect('/')
  );


export default AuthRouter;
