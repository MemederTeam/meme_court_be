import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 유저 생성
  async createUser(createUserDto: CreateUserDto) {
    // user_name 중복 체크
    const existing = await this.userRepository.findOne({
      where: { user_name: createUserDto.user_name },
    });

    if (existing) {
      throw new ConflictException('이미 존재하는 유저네임입니다');
    }

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    return {
      id: user.id,
      message: '유저가 생성되었습니다',
    };
  }

  // 유저 조회 (ID)
  async getUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다');
    }

    return user;
  }

  // 유저 조회 (username)
  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { user_name: username },
    });

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다');
    }

    return user;
  }

  // 전체 유저 목록
  async getAllUsers() {
    return this.userRepository.find({
      order: { created_at: 'DESC' },
    });
  }
}
