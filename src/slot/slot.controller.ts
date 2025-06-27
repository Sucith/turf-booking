import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
  Get,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { CreateSlotDto } from './create-slot.dto'; 
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorators'; 
import { Role } from 'src/auth/enums/roles.enums';
import { User } from 'src/user/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  // Create slot (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post() 
  createSlot(@Body() createSlotDto: CreateSlotDto) {
    return this.slotService.createSlot(createSlotDto);
  }

  // Book slot (User)
  @UseGuards(JwtAuthGuard)
  @Post('book/:id')
  bookSlot(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.slotService.bookSlot(id, user);
  }

  // Cancel booking (User)
  @UseGuards(JwtAuthGuard)
  @Delete(':id/cancel')
  cancelBooking(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.slotService.cancelBooking(id, user);
  }

  // Get available slots (Public or Authenticated)
  @Get('available')
  getAvailableSlots() {
    return this.slotService.getAvailableSlots();
  }
}
