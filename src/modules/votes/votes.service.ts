import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../../entities/vote.entity';
import { CreateVoteDto } from './create-vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  async createVote(createVoteDto: CreateVoteDto) {
    // 1. 이미 투표했는지 확인
    const existingVote = await this.voteRepository.findOne({
      where: {
        user_id: createVoteDto.user_id,
        post_id: createVoteDto.post_id,
      },
    });

    if (existingVote) {
      throw new ConflictException('이미 투표한 게시글입니다');
    }

    // 2. 투표 생성
    const vote = this.voteRepository.create(createVoteDto);
    await this.voteRepository.save(vote);

    return {
      id: vote.id,
      message: '투표가 완료되었습니다',
    };
  }

  async deleteAllVotes(userId: string) {
    const result = await this.voteRepository.delete({ user_id: userId });
    return {
      message: `${result.affected}개의 투표가 삭제되었습니다.`,
    };
  }
}
