import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: CreateUserDto) {
    return this.usersService.login(dto);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updatePassword(req.user.userId, dto);
  }
}
