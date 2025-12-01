import { IsNotEmpty, IsString, IsArray, IsUrl, IsOptional } from 'class-validator';

export class CreatePostDto {
  // @IsNotEmpty()
  // @IsString()
  user_id: string;

  // @IsOptional()
  // @IsString()
  value?: string; // 텍스트 내용 (선택)

  // @IsNotEmpty()
  // @IsUrl()
  image_url: string; // 이미지

  // @IsArray()
  // @IsString({ each: true })
  hashtags: string[]; // ["#고양이", "#밈"]
}
