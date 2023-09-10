import { IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateConvDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  status: number;

  @IsOptional()
  @IsString()
  password?: string;
}
