import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HashtagsService } from './hashtags.service';

@ApiTags('hashtags')
@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get('trending')
  @ApiOperation({ summary: '인기 해시태그 목록' })
  @ApiQuery({ name: 'limit', required: false, description: '반환할 해시태그 개수', example: 10 })
  @ApiResponse({ status: 200, description: '인기 해시태그 목록 (썸네일 포함)' })
  async getTrending(@Query('limit') limit?: number) {
    return this.hashtagsService.getTrendingHashtags(limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: '해시태그별 게시글 목록' })
  @ApiQuery({ name: 'userId', required: false, description: '투표 필터링용 유저 ID' })
  @ApiResponse({ status: 200, description: '게시글 목록 (userId가 있으면 투표 안한 것만)' })
  async getPostsByHashtag(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.hashtagsService.getPostsByHashtag(id, userId);
  }
}
