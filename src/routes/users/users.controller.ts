const bcrypt = require('bcrypt');
import { Request, Response, NextFunction } from 'express';

import { User, People } from '../../../lib_ts/types';
import UserModel from '../../models/UserModel';


const UserController = {
  createUser: async function (req: Request, res: Response, next: NextFunction) {
    const { username, password, email }: User = req.body;
    const newUser: User = {
      ...req.body
    }
    const processClientError = (message: string) => {
      return res.status(400).json({error: `client-error : ${message}`})
    }

    return (      // [] iterate error messages with greater detail; [] update tests
      (!username || !password) ? processClientError('required data not submitted')
      : (!UserUtilities._isValidUsername(username)) ? processClientError('username is invalid')
      : (!UserUtilities._isValidEmail(email)) ? processClientError('email is invalid')
      
      // -- validate password format if NOT encrypted client-side (...should be)
      // : (!UserUtilities._isValidPassword(password)) ? (console.log(password), processClientError(' password is invalid')) 
      
      : (newUser.password = await UserUtilities._encryptPassword(password),
          UserModel.create({ ...newUser })
            .then((data) => ((res.locals.data = data), next()))
            .catch((err) => next(err))
        )
    )
  },
  getByUsername: async function(req: Request, res: Response, next: NextFunction) {
    const username: string = req.params.username;

    UserModel.findOne({ username })
      .then((data: User | null) => ((res.locals.data = data), next()))
      .catch((err) => next(err));
  },
  getByID: (req: Request, res: Response, next: NextFunction) => {
    const _id: string = req.params.userID;

    UserModel.findById({ _id })
      .then((data: User | null) => ((res.locals.data = data), next()))
      .catch((err) => next(err));
  },
  getSelection: (req: Request, res: Response, next: NextFunction) => {
    UserModel.find({ _id: { $in: req.body } })
      .then((data: People) => ((res.locals.data = data), next()))
      .catch((err) => next(err));
  },
  getCollection: (req: Request, res: Response, next: NextFunction) => {
    UserModel.find({})
      .then((data: People) => ((res.locals.data = data), next()))
      .catch((err) => next(err));
  },
  editUser: (req: Request, res: Response, next: NextFunction) => {
    const _id: string = req.params.userID;
    const userdata: User = req.body;

    UserModel.findByIdAndUpdate(_id, { ...userdata })
      .then((data: User | null) => ((res.locals.data = data), next()))
      .catch((err) => next(err));
  },
  addFriends: (req: Request, res: Response, next: NextFunction) => {
    const _id: string = req.params.userID;

    UserModel.findByIdAndUpdate(_id, 
      {$addToSet: {friends: {$each: [...req.body]}}}
    )
      .then((data) => {
        res.locals.data = data;
        next();
      })
      .catch((err) => next(err));
  },
  deleteSelection: (req: Request, res: Response, next: NextFunction) => {
    UserModel.deleteMany({ _id: { $in: req.body } })
      .then(
        (data: { deletedCount: number }) => ((res.locals.data = data), next())
      )
      .catch((err) => next(err));
  },
  deleteByID: (req: Request, res: Response, next: NextFunction) => {
    const _id: string = req.params.userID;

    UserModel.findByIdAndDelete({ _id })
      .then((data: User | null) => ((res.locals.data = data), next()))
      .catch((err) => next(err));
  },
  deleteAll: (req: Request, res: Response, next: NextFunction) => {
    // ## admin only - implement auth check
    // !auth && return a 405
    UserModel.deleteMany({})
      .then(
        (data: { deletedCount: number }) => ((res.locals.data = data), next())
      )
      .catch((err) => next(err));
  },
};


export const UserUtilities = {
  _isValidUsername: (username: string): boolean => {
    return (
      typeof username === 'string' &&
      username.search(/\s/g) < 0 &&
      username.length < 21 &&
      username.length > 7
    );
  },
  _isUniqueUsername: async (username: string): Promise<boolean> => {
    const user: User | null = await UserModel.findOne({ username });
    return !user;
  },
  _isValidEmail: (email: string): boolean => {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(emailPattern) ? true : false;
  },
  _isUniqueEmail: async (email: string): Promise<boolean> => {
    const user: User | null = await UserModel.findOne({ email });
    return !user;
  },
  _isValidPassword: (password: string): boolean => {
    return (
      password.length > 7 &&
      password.length < 15 &&
      !!password.match(/[A-Z]/g) &&
      !!password.match(/[a-z]/g) &&
      !!password.match(/[0-9]/g) &&
      !!password.match(/[^a-zA-Z0-9]/g) &&
      !password.match(/\s/g)
    );
  },
  _encryptPassword: async function(password: string): Promise<string> {
    const saltRounds = 3;
    return await bcrypt.hash(password, saltRounds);
  },
  _getByUsername: async function(username: string): Promise<User | null> {
    return await UserModel.findOne({ username })
  }
}


export default UserController;
