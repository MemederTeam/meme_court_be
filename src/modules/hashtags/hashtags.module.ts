import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagsController } from './hashtags.controller';
import { HashtagsService } from './hashtags.service';
import { Hashtag } from '../../entities/hashtag.entity';
import { PostHashtag } from '../../entities/post-hashtag.entity';
import { Post } from '../../entities/post.entity';
import { Vote } from 'src/entities/vote.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Hashtag, PostHashtag, Post, Vote])],
  controllers: [HashtagsController],
  providers: [HashtagsService],
  exports: [HashtagsService],
})
export class HashtagsModule {}
