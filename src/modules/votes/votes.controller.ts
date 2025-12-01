import { Controller, Post, Body, Delete } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './create-vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  // POST /votes
  @Post()
  async create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.createVote(createVoteDto);
  }

  @Delete()
  async deleteAllVotes(@Body('userId') userId: string) {
    return this.votesService.deleteAllVotes(userId);
  }
}
