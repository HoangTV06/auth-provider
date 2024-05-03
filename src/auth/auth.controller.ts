import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
  Post,
  Session,
  Redirect,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get('authorize')
  @Redirect('/auth/login')
  async authorize(
    @Query() query: any,
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    session.authorizationParams = query;
    const { response_type, client_id, redirect_uri, scope } = query;
    if (response_type !== 'code') {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'unsupported_response_type' });
    }

    const client = await this.authService.validateClient(
      client_id,
      redirect_uri,
    );
    if (!client) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'unauthorized_client' });
    }

    if (!req.session.isLoggedIn) {
      return res.redirect(`./login`);
    }

    const user = req.session.user;

    const authorizationCode = await this.authService.generateAuthorizationCode(
      client,
      user,
      scope,
    );

    return res.redirect(redirect_uri + `?code=${authorizationCode}`);
  }

  @Get('login')
  getLogin(@Res() res: Response) {
    return res.sendFile('login.html', { root: 'public' });
  }

  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Email and password are required' });
    }

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid email or password' });
    }
    session.user = user;
    session.isLoggedIn = true;

    const authorizationParams = req.session.authorizationParams;
    return res.redirect(
      `./authorize?response_type=${authorizationParams?.response_type}&client_id=${authorizationParams?.client_id}&redirect_uri=${authorizationParams?.redirect_uri}&scope=${authorizationParams?.scope}`,
    );
  }

  @Get('register')
  getRegister(@Res() res: Response) {
    return res.sendFile('register.html', { root: 'public' });
  }

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {
    const { email, password, confirmPassword }: RegisterPayload = req.body;
    if (!email || !password || !confirmPassword) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Fields are required' });
    }
    if (password !== confirmPassword) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Passwords do not match' });
    }

    await this.userService.createUser({
      email,
      password,
    } as CreateUserDto);

    return res.redirect('./login');
  }

  @Post('/token')
  async getToken(@Req() req: Request, @Res() res: Response) {
    const { code, client_id, client_secret } = req.body;
    const token = await this.authService.generateAccessToken(
      client_id,
      client_secret,
      code,
    );
    return res.status(HttpStatus.OK).json(token);
  }
}

type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword: string;
};
