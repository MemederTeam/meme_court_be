import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Hashtag } from './hashtag.entity';

@Entity('post_hashtags')
export class PostHashtag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  post_id: string;

  @Column()
  hashtag_id: string;

  // Relations
  @ManyToOne(() => Post, (post) => post.postHashtags)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Hashtag, (hashtag) => hashtag.postHashtags)
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;
}
