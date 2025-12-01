import { Controller, Post, Body, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './create-vote.dto';

@ApiTags('votes')
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @ApiOperation({ summary: '투표하기' })
  @ApiResponse({ status: 201, description: '투표 성공' })
  @ApiResponse({ status: 409, description: '이미 투표한 게시글' })
  async create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.createVote(createVoteDto);
  }

  @Delete()
  @ApiOperation({ summary: '유저의 모든 투표 일괄 취소 (데모용)' })
  @ApiResponse({ status: 200, description: '투표 삭제 성공' })
  async deleteAllVotes(@Body('userId') userId: string) {
    return this.votesService.deleteAllVotes(userId);
  }
}
