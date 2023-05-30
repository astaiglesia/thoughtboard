import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../lib_ts/types';

export function globalErrorHandler(
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500,
    message =
      err.message ||
      `Express server has encountered an unexpected condition that prevented it from fulfilling the request. ${err}`;
  res.status(status).send({
    status,
    message,
  });
}
