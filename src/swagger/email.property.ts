import { ApiProperty } from '@nestjs/swagger';

export const ApiEmailProperty = () =>
  ApiProperty({
    description: 'Adresse email utilisateur',
    example: 'johndoe@gmail.com',
  });