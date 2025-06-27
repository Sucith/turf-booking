import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/roles.enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(
    username: string,
    email: string,
    password: string,
    phnum: string,
  ): Promise<User> {
    if (!username || !email || !password || !phnum) {
      throw new BadRequestException('All fields are required');
    }

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      phnum,
      role: Role.USER,
    });

    return this.userRepository.save(user);
  }
}
