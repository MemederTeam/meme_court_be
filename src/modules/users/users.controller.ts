import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({ status: 201, description: '유저 생성 성공' })
  @ApiResponse({ status: 409, description: '이미 존재하는 유저네임' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '유저 조회 (ID)' })
  @ApiResponse({ status: 200, description: '유저 정보 반환' })
  @ApiResponse({ status: 404, description: '유저를 찾을 수 없음' })
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get()
  @ApiOperation({ summary: '유저 목록 조회 또는 username으로 검색' })
  @ApiQuery({ name: 'username', required: false, description: '검색할 유저네임' })
  @ApiResponse({ status: 200, description: '유저 목록 또는 단일 유저 반환' })
  async getUsers(@Query('username') username?: string) {
    if (username) {
      return this.usersService.getUserByUsername(username);
    }
    return this.usersService.getAllUsers();
  }
}
