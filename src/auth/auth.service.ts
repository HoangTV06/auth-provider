import { BadRequestException, Injectable } from '@nestjs/common';
import { EncryptService } from 'src/encrypt/encrypt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Client } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptService: EncryptService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user && this.encryptService.match(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateClient(
    clientId: string,
    redirectUri: string,
  ): Promise<Client | null> {
    const client = await this.prismaService.client.findUnique({
      where: { clientId },
    });

    if (client && client.redirectUri === redirectUri) {
      return client;
    }
    return null;
  }

  async validateAuthorizationCode(code: string) {
    const authorizationCode =
      await this.prismaService.authorizationCode.findUnique({
        where: { code },
      });
    if (authorizationCode) {
      return authorizationCode;
    }
    return null;
  }

  async generateAuthorizationCode(
    client: Client,
    user: any,
    scope: string,
  ): Promise<string> {
    const code = Math.random().toString(36).substring(2);
    await this.prismaService.authorizationCode.create({
      data: {
        code,
        clientId: client.id,
        userId: user.id,
        scope,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      },
    });
    return code;
  }

  async generateAccessToken(
    clientId: string,
    clientSecret: string,
    code: string,
  ) {
    const client = await this.prismaService.client.findUnique({
      where: { clientId },
    });
    if (
      !client ||
      !this.encryptService.match(clientSecret, client.clientSecret)
    ) {
      throw new BadRequestException('Invalid client credentials');
    }

    const authorizationCode =
      await this.prismaService.authorizationCode.findUnique({
        where: { code },
        include: {
          Client: true,
          User: true,
        },
      });

    if (
      authorizationCode &&
      authorizationCode.Client.clientId === clientId &&
      (await this.encryptService.match(
        clientSecret,
        authorizationCode.Client.clientSecret,
      ))
    ) {
      // Generate token
      const payload = {
        code,
        client_id: clientId,
        ...(authorizationCode.scope.includes('openid') && {
          user_id: authorizationCode.userId,
          email: authorizationCode.User.email,
        }),
        exp: Math.floor(Date.now() / 1000) + 60 * 5,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
      };
      const token = this.jwtService.sign(payload);
      const res = await this.prismaService.token.create({
        data: {
          accessToken: token,
          clientId: authorizationCode.clientId,
          userId: authorizationCode.userId,
          accessTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 5),
        },
        select: {
          accessToken: true,
          accessTokenExpiresAt: true,
        },
      });
      return res;
    }
    return null;
  }

  generateState(): string {
    return Math.random().toString(36).substring(2);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
