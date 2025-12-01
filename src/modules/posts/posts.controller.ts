import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // POST /posts
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  // GET /posts/:id
  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }
}
