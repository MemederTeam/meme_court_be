import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '게시글 작성' })
  @ApiResponse({ status: 201, description: '게시글 생성 성공' })
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 조회' })
  @ApiResponse({ status: 200, description: '게시글 상세 정보 반환' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없음' })
  async getPost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }
}
