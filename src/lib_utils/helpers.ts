import { Request, Response } from 'express';

export function processResponse(status: number) {
  return function (req: Request, res: Response): void {
    res.status(status).json(res.locals.data);
  };
}
export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}