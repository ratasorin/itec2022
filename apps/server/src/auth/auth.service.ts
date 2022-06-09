import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/interfaces';
import { JwtUser } from './interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.getUser(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { name: user.name, sub: user.id } as JwtUser;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signIn(user: User) {
    const createdUser = await this.userService.createUser(user);
    if (!createdUser)
      throw new HttpException(
        'FAILED TO CREATE USER',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return {
      access_token: this.jwtService.sign({
        name: createdUser.name,
        sub: createdUser.id,
      } as JwtUser),
    };
  }
}
