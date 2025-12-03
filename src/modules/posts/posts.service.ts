import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { Hashtag } from '../../entities/hashtag.entity';
import { PostHashtag } from '../../entities/post-hashtag.entity';
import { CreatePostDto } from './create-post.dto';
import { supabase } from 'src/config/supabase.config';

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
  async createPost(file: Express.Multer.File, createPostDto: CreatePostDto) {
    const { user_id, value, hashtags } = createPostDto;

    // 🔥 파일 객체 전체 확인
    console.log('🔍 받은 파일 객체:', {
      fieldname: file?.fieldname,
      originalname: file?.originalname,
      encoding: file?.encoding,
      mimetype: file?.mimetype,
      size: file?.size,
      buffer_exists: !!file?.buffer,
    });

    if (!file) {
      throw new Error('이미지 파일이 필요합니다');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new Error(`이미지 파일만 가능합니다. 현재: ${file.mimetype}`);
    }

    // 0. storage에 이미지 업로드
    const filePath = `${Date.now()}_${file.originalname}`;
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype, // 중요: 파일의 MIME 타입 설정!!!!!!!하!!!!
      });
    if (error) {
      console.error('❌ Supabase 전체 에러:', JSON.stringify(error, null, 2));
      console.error('❌ 에러 타입:', typeof error);
      console.error('❌ 에러 키들:', Object.keys(error));
      throw new Error('이미지 업로드 실패:' + error.message);
    }
    const { data: publicUrlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // 1. 게시글 생성
    const post = this.postRepository.create({
      user_id,
      value,
      image_url: imageUrl,
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

  //전체 게시글 목록 조회
  async getAllPosts(limit?: number, offset?: number) {
    const posts = await this.postRepository.find({
      relations: ['user', 'postHashtags', 'postHashtags.hashtag', 'votes'],
      order: { created_at: 'DESC' }, //최신순
      take: limit || 20,
      skip: offset || 0, //페이징
    });

    return posts.map((post) => ({
      id: post.id,
      value: post.value,
      image_url: post.image_url,
      created_at:post.created_at,
      user:{
        id:post.user.id,
        user_name:post.user.user_name,
        display_name:post.user.display_name,
        profile_image_url:post.user.profile_image_url,
        profile_url:post.user.profile_url,
      },
      hashtags:post.postHashtags.map((ph)=>ph.hashtag.name),
      vote_count: {
        funny: post.votes.filter((v) => v.is_funny).length,
        not_funny: post.votes.filter((v) => !v.is_funny).length,
        total: post.votes.length,
      },
    }));
  }
}
