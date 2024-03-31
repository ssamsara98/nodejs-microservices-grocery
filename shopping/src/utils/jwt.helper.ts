import { verify } from 'jsonwebtoken';
import { env } from '~/config/env.config';

export const verifyToken = (token: string) => {
  const payload = verify(token, env.JWT_SECRET!);
  return payload;
};
