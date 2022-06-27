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

  async validateUser(email: string, password: string): Promise<UserDB | null> {
    const user = await this.userService.authenticateUser(email, password);
    return user;
  }

  async login(user: UserDB) {
    const payload: JwtUser = {
      email: user.email,
      name: user.name,
      id: user.id,
    };
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
        email: createdUser.email,
        id: createdUser.id,
      } as JwtUser),
    };
  }
}
