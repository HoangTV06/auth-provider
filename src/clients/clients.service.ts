import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createClientDto: CreateClientDto) {
    try {
      return this.prismaService.client.create({ data: createClientDto });
    } catch {
      throw new BadRequestException('Client already exists');
    }
  }

  // findAll() {
  //   return `This action returns all clients`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} client`;
  // }

  update(id: number, updateClientDto: UpdateClientDto) {
    try {
      return this.prismaService.client.update({
        where: { id },
        data: updateClientDto,
      });
    } catch {
      throw new BadRequestException('Update client failed');
    }
  }

  remove(id: number) {
    return this.prismaService.client.deleteMany({ where: { id } });
  }
}
