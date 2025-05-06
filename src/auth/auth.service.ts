import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService
, private readonly jwtService: JwtService
  ) {}
  
  async validateUser({username, password}): Promise<{ access_token: string } | { status: string, message: string }> {
    console.log("Entered validateUser method in AuthService");
    const user = await this.usersService.findByLogin(username);
    if(!user) {
      throw new NotFoundException('User not found');
    }
    console.log('Password:', password, 'Hash:', user?.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    // Generate JWT token
    const payload = { username: user.username, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return {access_token: token};
  }


}
