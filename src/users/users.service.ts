import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {username, password} = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 9); 

    const user = this.usersRepository.create({
      username,
      password: hashedPassword, 
    });

    const savedUser = await this.usersRepository.save(user);

    const payload = { username: user.username, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return {
      "status": "success",
      "message": "User created successfully",
      "data": {
        username: savedUser.username, 
        createdAt: savedUser.createdAt,
        access_token: token}
    }
  }

  async updatePassword(userId: number, dto: UpdateUserDto){
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const passwordMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordMatch) {
      throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 9);
    user.password = hashedNewPassword;
    user.updatedAt = new Date();
    await this.usersRepository.save(user);
    return {
      "status": "success",
      "message": "Password updated successfully",
    }
  }
  
  async findByLogin(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ username });
    return user || null;
  }
}
