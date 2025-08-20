import { PassportStrategy } from "@nestjs/passport";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import * as dotenv from 'dotenv';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService,
      @InjectRepository(User) private userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'default',
          });
        console.log('JwtStrategy constructor called');
    }

    async validate(payload: any) {
        console.log('payload', payload);
        if (!payload || !payload.sub) {
            throw new UnauthorizedException('Invalid or expired token');
          }
        const user = await this.userRepository.findOne({
            where: { id: payload.sub }
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return { userId: payload.sub, login: payload.login }; // can be found in req.user
    }
}