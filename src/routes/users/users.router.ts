import { Router, Request, Response } from 'express';
import UserController from './users.controller';

export function processResponse(status: number) {
  return function (req: Request, res: Response): void {
    res.status(status).json(res.locals.data);
  };
}

const UserRouter: Router = Router();
UserRouter
  .post('/', UserController.createUser, processResponse(201))

  .get('/:userID', UserController.getByID, processResponse(200))
  .get('/', UserController.getCollection, processResponse(200))

  .put('/:userID/friends', UserController.addFriends, processResponse(200))
  .put('/:userID', UserController.editUser, processResponse(200))

  .delete('/selection', UserController.deleteSelection, processResponse(200))
  .delete('/:userID', UserController.deleteByID, processResponse(200))
  .delete('/', UserController.deleteAll, processResponse(200)) // [] restrict to admin roles

  // --- no test coverage
  .get('/:userID/selection', UserController.getSelection, processResponse(200));


export default UserRouter;
