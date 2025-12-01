import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  user_name: string; // unique

  @IsNotEmpty()
  @IsString()
  display_name: string;

  @IsOptional()
  @IsUrl()
  profile_image_url?: string;

  @IsOptional()
  @IsUrl()
  profile_url?: string;
}
