import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInInput, SignUpInput } from './dto';
import { AuthResponseType } from './types/auth-response.type';
import { User } from '../users/entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInInput: SignInInput): Promise<AuthResponseType> {
    const user = await this.userService.findOneByEmail(signInInput.email);
    const isMatch = await argon2.verify(user.password, signInInput.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    return {
      user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
  async signUp(signUpInput: SignUpInput): Promise<AuthResponseType> {
    const user = await this.userService.create(signUpInput);
    return {
      token: this.getJwtToken({ id: user.id }),
      user,
    };
  }
  async revalidate(user: User): Promise<AuthResponseType> {
    return {
      user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async validate(id: string) {
    let user: User;
    try {
      user = await this.userService.findOne(id);
    } catch {
      throw new UnauthorizedException();
    }
    if (!user.isActive) throw new UnauthorizedException('inactive user');
    return user;
  }

  private getJwtToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}
