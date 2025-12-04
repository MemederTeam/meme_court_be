import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Hashtag } from '../../entities/hashtag.entity';
import { PostHashtag } from '../../entities/post-hashtag.entity';
import { Post } from '../../entities/post.entity';
import { Vote } from '../../entities/vote.entity';
import { hash } from 'crypto';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
    @InjectRepository(PostHashtag)
    private postHashtagRepository: Repository<PostHashtag>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  // 핫 해시태그 목록 (게시글 많은 순) + 사진
  async getTrendingHashtags(limit: number = 10) {
    const result = await this.postHashtagRepository
      .createQueryBuilder('ph') // post_hashtags 테이블을 'ph'라는 별칭으로
      .select('ph.hashtag_id', 'hashtag_id') // hashtag_id 컬럼 선택
      .addSelect('COUNT(ph.post_id)', 'post_count') // 게시글 수 카운트
      .groupBy('ph.hashtag_id') // 해시태그별로 그룹화
      .orderBy('post_count', 'DESC') // 많은 순 정렬
      .limit(limit) // 상위 N개만
      .getRawMany(); // raw SQL 결과로 가져옴

    // 해시태그 정보 가져오기
    const hashtagIds = result.map((r) => r.hashtag_id); //// [1, 3, 5, ...]
    const hashtags = await this.hashtagRepository.findBy({
      id: In(hashtagIds),
    });

    // 각 해시태그별로 대표 이미지 3개씩
    const trendingWithImages = await Promise.all(
      result.map(async (r) => {
        const hashtag = hashtags.find((h) => h.id === r.hashtag_id);
        if (!hashtag) return null;

        // 해당 해시태그의 최근 게시글 3개
        const recentPosts = await this.postHashtagRepository.find({
          where: { hashtag_id: r.hashtag_id },
          relations: ['post'],
          order: { post: { created_at: 'DESC' } }, //최신글
          take: 3, //3개
        });

        return {
          id: hashtag.id,
          name: hashtag.name,
          post_count: parseInt(r.post_count),
          thumbnail_images: recentPosts.map((ph) => ph.post.image_url),
        };
      }),
    );

    return trendingWithImages;
  }

  // 특정 해시태그의 게시글 목록
  async getPostsByHashtag(hashtagId: string, userId?: string) {
    //user가 이미 투표한 post id들
    let votedPostIds: string[] = [];
    if (userId) {
      const votes = await this.voteRepository.find({
        where: { user_id: userId },
        select: ['post_id'],
      });
      votedPostIds = votes.map((v) => v.post_id);
    }

    const postHashtags = await this.postHashtagRepository.find({
      where: { hashtag_id: hashtagId },
      relations: ['post', 'post.user', 'post.votes', 'post.postHashtags', 'post.postHashtags.hashtag'],
      order: { post: { created_at: 'DESC' } }, //최신순 정렬.
    });

    return postHashtags.filter(ph=>!votedPostIds.includes(ph.post.id)).map((ph) => ({
      id: ph.post.id,
      value: ph.post.value,
      image_url: ph.post.image_url,
      created_at: ph.post.created_at,
      user: {
        id: ph.post.user.id,
        user_name: ph.post.user.user_name,
        display_name: ph.post.user.display_name,
        profile_image_url: ph.post.user.profile_image_url,
        user_profile_url: ph.post.user.profile_url,
      },
      vote_count: {
          funny: ph.post.votes.filter((v) => v.is_funny).length,
          not_funny: ph.post.votes.filter((v) => !v.is_funny).length,
          total: ph.post.votes.length,
        },
    }));
  }
}
