import { IsNotEmpty, IsString, IsUrl, IsInt, ArrayNotEmpty, ArrayMinSize } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  ID_19: string;

  @IsNotEmpty()
  @IsString()
  Pseudo: string;

  @IsNotEmpty()
  @IsUrl()
  Avatar: string;

  @IsInt()
  Coins: number;

  @IsInt()
  Actual_skin: number;

  @ArrayNotEmpty()
  @ArrayMinSize(1)
  Global_skin: number[];

  @IsInt()
  Wins: number;

  @IsInt()
  Loses: number;

  @IsString()
  email: string;
}
