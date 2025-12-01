import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { Hashtag } from '../../entities/hashtag.entity';
import { PostHashtag } from '../../entities/post-hashtag.entity';
import { CreatePostDto } from './create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
    @InjectRepository(PostHashtag)
    private postHashtagRepository: Repository<PostHashtag>,
  ) {}

  // 게시글 작성
  async createPost(createPostDto: CreatePostDto) {
    const { user_id, value, image_url, hashtags } = createPostDto;

    // 1. 게시글 생성
    const post = this.postRepository.create({
      user_id,
      value,
      image_url,
    });
    await this.postRepository.save(post);

    // 2. 해시태그 처리
    for (const tagName of hashtags) {
      // 해시태그가 이미 있는지 확인
      let hashtag = await this.hashtagRepository.findOne({
        where: { name: tagName },
      });

      // 없으면 생성
      if (!hashtag) {
        hashtag = this.hashtagRepository.create({ name: tagName });
        await this.hashtagRepository.save(hashtag);
      }

      // 3. post_hashtags 매핑 생성
      const postHashtag = this.postHashtagRepository.create({
        post_id: post.id,
        hashtag_id: hashtag.id,
      });
      await this.postHashtagRepository.save(postHashtag);
    }

    return {
      id: post.id,
      message: '게시글이 생성되었습니다.',
    };
  }

  // 게시글 조회 (단일) -> 안 쓸것 같음.
  async getPost(postId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'postHashtags', 'postHashtags.hashtag'],
    });

    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    return {
      id: post.id,
      value: post.value,
      image_url: post.image_url,
      created_at: post.created_at,
      user: {
        id: post.user.id,
        user_name: post.user.user_name,
        display_name: post.user.display_name,
        profile_image_url: post.user.profile_image_url,
        profile_url: post.user.profile_url,
      },
      hashtags: post.postHashtags.map((ph) => ph.hashtag.name),
    };
  }
}
