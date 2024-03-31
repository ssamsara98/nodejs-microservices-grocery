import { compare, genSalt, hash } from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = await genSalt(12);
  const hashed = await hash(password, salt);
  return hashed;
};

export const comparePassword = async (password: string, hashed: string) => {
  const isMatch = await compare(password, hashed);
  return isMatch;
};
