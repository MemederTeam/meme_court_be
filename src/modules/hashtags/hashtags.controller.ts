import { Controller, Get, Param, Query } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  // GET /hashtags/trending?limit=10
  @Get('trending')
  async getTrending(@Query('limit') limit?: number) {
    return this.hashtagsService.getTrendingHashtags(limit || 10);
  }

  // GET /hashtags/:id
  @Get(':id')
  async getPostsByHashtag(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.hashtagsService.getPostsByHashtag(id, userId);
  }
}
