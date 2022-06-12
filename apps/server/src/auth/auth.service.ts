import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User as UserDB } from '../../generated/schema';
import { UserDTO } from '../user/interfaces';
import { JwtUser } from './interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserDB | null> {
    const user = await this.userService.getUserByName(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(user: UserDB) {
    const payload: JwtUser = { name: user.name, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(user: UserDTO) {
    const createdUser = await this.userService.createUser(user);
    if (!createdUser)
      throw new HttpException(
        'FAILED TO CREATE USER',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    return {
      access_token: this.jwtService.sign({
        name: createdUser.name,
        id: createdUser.id,
      }),
    };
  }
}
