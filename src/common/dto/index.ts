import { ApiProperty } from "@nestjs/swagger"

export class PaginationMetoDto {
  @ApiProperty({ example: 4 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit:  number;

  @ApiProperty({ example: 1 })
  totalPages:  number;
}