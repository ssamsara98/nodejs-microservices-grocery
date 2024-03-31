import expressAsyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';

export const validationMiddleware = expressAsyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array();
    res.status(422).json(errors);
    return;
  }
  next();
});
