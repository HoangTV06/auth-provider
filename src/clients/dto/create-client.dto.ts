import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty()
  clientId: string;

  @ApiProperty()
  clientSecret: string;

  @ApiProperty()
  redirectUri: string;

  @ApiProperty()
  name: string;
}
