import { IsNotEmpty, IsInt } from 'class-validator';

export class EndMatchDto {
  @IsNotEmpty()
  Score_user1: number;

  @IsNotEmpty()
  Score_user2: number;

  @IsNotEmpty()
  @IsInt()
  Id: number;
}
