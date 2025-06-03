import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorators';
import { Role } from 'src/auth/enums/roles.enums';

@Controller('users')
@UseGuards(JwtAuthGuard) // Applies to all routes in this controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    const { username, email, password, phnum } = createUserDto;

    if (!username || !email || !password || !phnum) {
      throw new BadRequestException('All fields are required');
    }

    const user = await this.userService.register(
      username,
      email,
      password,
      phnum,
    );
    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  @Get('test')
  test() {
    return 'User controller works!';
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // ✅ Admin-only route
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('admin-only')
  adminOnly(@Request() req) {
    return {
      message: 'Access granted to admin route',
      user: req.user,
    };
  }
}
