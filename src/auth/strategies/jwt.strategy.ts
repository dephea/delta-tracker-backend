import { PassportStrategy } from "@nestjs/passport";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
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

        return { userId: payload.sub, login: payload.login }; // req.user
    }
}