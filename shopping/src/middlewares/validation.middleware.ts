import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';

export const validationMiddleware = expressAsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json(errors.array());
    return;
  }
  next();
});
