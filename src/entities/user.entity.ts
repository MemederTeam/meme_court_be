import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './post.entity';
import { Vote } from './vote.entity';

@Entity('users')
export class User {
  //userId
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //profileImageUrl
  @Column({ nullable: true })
  profile_image_url: string;

  //
  @Column()
  display_name: string;

  //
  @Column({ unique: true })
  user_name: string;

  @Column({ nullable: true })
  profile_url: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToMany(() => Post, (post) => post.user) //post엔티티에서는 post.user로 역참조
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user) //vote엔티티에서는 vote.user로 역참조
  votes: Vote[];
}
