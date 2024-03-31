import { Request } from 'express';

interface SuccessJson<T = unknown> {
  message: string;
  result: T;
}

export function successJson<T>(data: T): SuccessJson<T> {
  return {
    message: 'success',
    result: data,
  };
}

export function errorJson<T extends Error>(req: Request, err: T) {
  return {
    message: 'error',
    name: err.name,
    ...(req.app.get('env') === 'development' ? { stack: err.stack, err } : {}),
  };
}
