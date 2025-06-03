import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existing = await this.userRepo.findOneBy({ email: data.email });
    if (existing) throw new UnauthorizedException('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({ ...data, password: hashedPassword });
    await this.userRepo.save(user);
    return { message: 'User registered successfully' };
  }

  async login(data: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: data.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

   const payload = {
  sub: user.id,
  role: user.role,
  username: user.username,
  email: user.email,
};

    const token = this.jwtService.sign(payload);
    return { token };
  }
}
