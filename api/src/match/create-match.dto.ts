import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateMatchDto {
  @IsNotEmpty()
  ID_user1: number;

  @IsNotEmpty()
  ID_user2: number;

  @IsNotEmpty()
  @IsInt()
  Score_user1: number;

  @IsNotEmpty()
  @IsInt()
  Score_user2: number;
}
