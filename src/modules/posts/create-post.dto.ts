import { IsNotEmpty, IsString, IsArray, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: '작성자 유저 ID',
    example: 'user-uuid-123',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    description: '게시글 텍스트 내용',
    example: '이 밈 너무 웃겨요 ㅋㅋ',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({
    description: '이미지 URL',
    example: 'https://example.com/meme.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  image_url: string;

  @ApiProperty({
    description: '해시태그 배열',
    example: ['#고양이', '#밈'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  hashtags: string[];
}
