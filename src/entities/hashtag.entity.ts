import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  //CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PostHashtag } from './post-hashtag.entity';

@Entity('hashtags')
export class Hashtag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //예시 : #고양이
  @Column({ unique: true })
  name: string;

  // Relations
  @OneToMany(() => PostHashtag, (postHashtag) => postHashtag.hashtag)
  postHashtags: PostHashtag[];
}
