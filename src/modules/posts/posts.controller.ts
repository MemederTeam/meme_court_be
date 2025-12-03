import { Controller, Post, Get, Param, Body, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '게시글 작성' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({  
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: '밈 이미지 파일',
        },
        value: {
          type: 'string',
          description: '밈 텍스트',
          example: '이게 웃기니?',
        },
        user_id: {
          type: 'string',
          description: '작성자 ID',
        },
        hashtags: {
          type: 'array',
          items: { type: 'string' },
          description: '해시태그 배열',
          example: ['funny', 'dark'],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '게시글 생성 성공' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(file, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 게시글 목록' })
  @ApiQuery({ name: 'limit', required: false, description: '가져올 개수', example: 20 })
  @ApiQuery({ name: 'offset', required: false, description: '건너뛸 개수 (페이징)', example: 0
  })
  @ApiResponse({ status: 200, description: '게시글 목록 반환 (최신순)' })
  async getAllPosts(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.postsService.getAllPosts(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 조회' })
  @ApiResponse({ status: 200, description: '게시글 상세 정보 반환' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없음' })
  async getPost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }
}
