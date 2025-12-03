import { IsNotEmpty, IsString, IsArray, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
    description: '해시태그 배열',
    example: ['#고양이', '#밈'],
    type: [String],
  })
  @Transform(({ value }): string[] => {
    // JSON 문자열 → 배열 변환
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value) as unknown;
        if (Array.isArray(parsed)) {
          return parsed as string[]; // 🔥 명시적 타입 단언
        }
        return [String(parsed)]; // 🔥 단일 값은 문자열 변환 후 배열
      } catch {
        return [value];
      }
    }
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsString({ each: true })
  hashtags: string[];
}
