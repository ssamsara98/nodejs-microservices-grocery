import { sign, verify } from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import { env } from '~/config/env.config';
import { ICustomer } from '~/schemas/customer.schema';

export const createToken = (user: HydratedDocument<ICustomer>) => {
  const { password: _, ...usr } = user.toJSON();
  const payload = { sub: usr.id };
  const token = sign(payload, env.JWT_SECRET!, {
    expiresIn: env.NODE_ENV === 'production' ? '30d' : '1h',
  });
  return token;
};

export const verifyToken = (token: string) => {
  const payload = verify(token, env.JWT_SECRET!);
  return payload;
};
