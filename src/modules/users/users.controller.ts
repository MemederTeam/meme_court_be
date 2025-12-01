import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // GET /users/:id
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  // GET /users?username=xxx
  @Get()
  async getUsers(@Query('username') username?: string) {
    if (username) {
      return this.usersService.getUserByUsername(username);
    }
    return this.usersService.getAllUsers();
  }
}
