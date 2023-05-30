import { Request, Response, NextFunction } from 'express';
import { Message, Messages } from '../../../lib_ts/types';
import MessageModel from '../../models/MessagesModel';

const MessageController = {
  getCollection: (req: Request, res: Response, next: NextFunction) => {
    MessageModel.find({})
      .then(data => (console.log('returned data', data), data))
      .then((data: Messages) => ((res.locals.data = data), next()))
      .catch((err) => next(err));
  },
  getByID: (req: Request, res: Response, next: NextFunction) => {
    const _id: string = req.params.messageID;

    MessageModel.findById({ _id })
      .then((data: Message | null) => ((res.locals.data = data), next()))
      .catch((err) => next(err));
  },
   postNewItem: function (req: Request, res: Response, next: NextFunction) {
    const { content }: Message = req.body;

    return !content
      ? res.status(400).json({
          error: 'client-error : required data not submitted',
        })
      : MessageModel.create({ ...req.body })
          .then((data) => ((res.locals.data = data), next()))
          .catch((err) => next(err));
  },
  editItem: (req: Request, res: Response, next: NextFunction) => {
    const _id: string = req.params.messageID;
    const { content, author, userID, props }: Message = req.body;

    return !author || !userID || !content
      ? res.status(204).json({
          error: 'client-error : required content not submitted',
        })
      : MessageModel.findByIdAndUpdate(_id, { content, author, userID, props })
          .then((data: Message | null) => ((res.locals.data = data), next()))
          .catch((err) => next(err));
  },

  // ## admin only - implement an auth check
  deleteAllItems: (req: Request, res: Response, next: NextFunction) => {
    // !auth && res.status(405).json({
        //   error: 'client-error : required content not submitted',
        // })

    MessageModel.deleteMany({})
      .then(
        (data: { deletedCount: number }) => ((res.locals.data = data), next())
      )
      .catch((err) => next(err));
  },
  // ## admin only - implement auth check
  deleteSelection: (req: Request, res: Response, next: NextFunction) => {
    const options: string[] = req.body;

    // !auth && return a 405
    MessageModel.deleteMany({ options })
      .then(
        (data: { deletedCount: number }) => ((res.locals.data = data), next())
      )
      .catch((err) => next(err));
  },
  deleteItem: (req: Request, res: Response, next: NextFunction) => {
    const _id: string = req.params.messageID;

    MessageModel.findByIdAndDelete({ _id })
      .then((data: Message | null) => ((res.locals.data = data), next()))
      .catch((err) => next(err));
  },
};

export default MessageController;
