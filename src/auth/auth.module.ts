import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './strategies/local.guard';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, LocalStrategy, LocalAuthGuard],
  imports: [forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default',
      signOptions: { expiresIn: '1h' }}),
    TypeOrmModule.forFeature([User]) 
    ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
