import { Request, Response, NextFunction } from 'express';
/** --- ensureAuthenticated() ---
 * 
 *  Simple routing middleware to verify a user's auth status
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 * 
 * Use this route middleware on any resource that needs to be protected.  
 * If the request is authenticated (typically via a persistent login session),
 * the request will proceed.  
 * Otherwise, the user is redirected to the login page.
 * 
 */
function verifyLoggedIn(req: Request, res: Response, next: NextFunction) {
  // console.log('--------------------- Current user is:', req.user);
  const isLoggedIn: boolean | Express.User = req.isAuthenticated() && req.user;

  return (isLoggedIn) 
    ? next() 
    : (
       console.error('+++++ Users must be logged in to view this resource! +++++'),
       res.status(401).redirect('/auth/login')
      )
}

export default verifyLoggedIn;
