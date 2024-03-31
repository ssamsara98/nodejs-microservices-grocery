import e from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { _id: string; id: string } | null;
    }
  }
}
