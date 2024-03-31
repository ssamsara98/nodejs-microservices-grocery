import expressAsyncHandler from 'express-async-handler';
import { LoginUserRequest, RegisterUserRequest } from '~/dto/auth.request';
import { AuthService, authService } from '~/services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = expressAsyncHandler<any, any, RegisterUserRequest>(async (req, res) => {
    const user = await this.authService.register(req.body);
    res.status(201).json(user);
  });

  login = expressAsyncHandler<any, any, LoginUserRequest>(async (req, res) => {
    const accessToken = await this.authService.login(req.body);
    res.json({ accessToken });
  });
}

export const authController = new AuthController(authService);
