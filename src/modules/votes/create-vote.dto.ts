import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateVoteDto {
  // @IsNotEmpty()
  // @IsString()
  post_id: string;

  // @IsNotEmpty()
  // @IsString()
  user_id: string;

  // @IsNotEmpty()
  // @IsBoolean()
  is_funny: boolean; // true: 재미있음, false: 재미없음
}
