import { Injectable } from '@nestjs/common';
import { EncryptService } from 'src/encrypt/encrypt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptService: EncryptService,
  ) {}

  async createUser({ email, password }: CreateUserDto) {
    const hashedPassword = await this.encryptService.hash(password);

    return this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  findUserById(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
