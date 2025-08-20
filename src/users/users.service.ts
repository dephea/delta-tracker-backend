import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(dto: CreateUserDto) {
    const {username, password} = dto;
    const hashedPassword = await bcrypt.hash(password, 9); 

    const alreadyExists = await this.usersRepository.findOne({ where : { username }});
    if(alreadyExists) {
      throw new ConflictException(`username ${username} already exists`);
    }

    const user = this.usersRepository.create({
      username,
      password: hashedPassword, 
    });

    try {
      
      const savedUser = await this.usersRepository.save(user);

      const payload = { username: user.username, sub: user.id };
      const token = await this.jwtService.signAsync(payload);

      return {
        "status": "success",
        "access_token": token,
        "data": {
          username: savedUser.username, 
          createdAt: savedUser.createdAt}
      }
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async login(dto: CreateUserDto) {
    const {username, password} = dto;
    const hashedPassword = await bcrypt.hash(password, 9); 

    const user = await this.usersRepository.findOne({
      where: {username}
    });
    if(!user) {
      throw new NotFoundException(`User ${username} was not found`);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) {
      throw new BadRequestException(`Invalid credentials`);
    }

    const payload = { username: user.username, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return {
        "status": "success",
        "access_token": token,
      }
  }

  async updatePassword(userId: number, dto: UpdateUserDto){
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const passwordMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Current password is incorrect');
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
