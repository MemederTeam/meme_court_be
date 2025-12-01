import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '유저네임 (unique)',
    example: 'memeLover',
  })
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @ApiProperty({
    description: '표시 이름',
    example: '밈왕',
  })
  @IsNotEmpty()
  @IsString()
  display_name: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  profile_image_url?: string;

  @ApiProperty({
    description: '프로필 페이지 URL',
    example: 'https://twitter.com/memelover',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  profile_url?: string;
}
