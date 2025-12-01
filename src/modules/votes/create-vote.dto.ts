import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteDto {
  @ApiProperty({
    description: '게시글 ID',
    example: 'post-uuid-123',
  })
  @IsNotEmpty()
  @IsString()
  post_id: string;

  @ApiProperty({
    description: '투표자 유저 ID',
    example: 'user-uuid-456',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    description: '재밌음 여부 (true: 재밌음, false: 안재밌음)',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_funny: boolean;
}
