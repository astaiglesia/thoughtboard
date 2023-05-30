import { Request, Response, NextFunction } from 'express';

export function logTheRequest(req: Request, res: Response, next: NextFunction): void {
  const start: number = Date.now(),
    init: Date = new Date();
  next();
  const finish: number = Date.now();

  console.log(`${req.method} request made to the ${req.baseUrl}${req.url} endpoint`);
  console.log(`--- initiated at: `, init);
  console.log(`total processing time: `, finish - start, 'ms');
}

// localhost ip '::1' is IPv6 syntax for '127.0.0.1' (IPv4)
export function ipLogger(req: Request, res: Response, next: NextFunction): void {
  console.log(`${req.method} request made from ${req.ip}`);
  next();
}