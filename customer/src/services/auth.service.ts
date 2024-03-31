import createHttpError from 'http-errors';
import { db } from '~/infrastructures/db';
import { createToken } from '~/utils/jwt.helper';
import { LoginUserRequest, RegisterUserRequest } from '~/dto/auth.request';

export class AuthService {
  constructor(private readonly database: typeof db) {}

  private loginError() {
    throw createHttpError(400, 'Email or Password is invalid');
  }

  async findEmail(email: string) {
    const user = await this.database.Customer.findOne({ email });
    if (user) throw createHttpError(409, 'Email already exist');
  }

  async register(registerUserRequest: RegisterUserRequest) {
    const { email, password, telephone } = registerUserRequest;
    await this.findEmail(email);
    const user = new this.database.Customer({
      email,
      password,
      telephone,
      address: [],
    });
    await user.save();
    return user;
  }

  async login(loginRequest: LoginUserRequest) {
    const { email, password } = loginRequest;
    const user = await this.database.Customer.findOne({ email });
    if (!user) throw this.loginError();

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) throw this.loginError();

    const accessToken = createToken(user);
    return accessToken;
  }
}

export const authService = new AuthService(db);
