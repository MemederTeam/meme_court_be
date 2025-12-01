import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from '../../entities/post.entity';
import { Hashtag } from '../../entities/hashtag.entity';
import { PostHashtag } from '../../entities/post-hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Hashtag, PostHashtag])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
