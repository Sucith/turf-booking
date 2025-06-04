// src/slot/slot.controller.ts
import {  Controller,Post,Body,UseGuards,Request,Get,} from '@nestjs/common';
import { SlotService } from './slot.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorators';
import { Role } from 'src/auth/enums/roles.enums';

class CreateSlotDto {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24hr)
  endTime: string; // HH:mm (24hr)
}

@Controller('slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  // Admin only: create slots
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async createSlots(@Body() slots: CreateSlotDto[], @Request() req) {
    console.log('Slots body:', slots);
    const adminUserId = req.user.userId;
    return this.slotService.createSlots(slots, adminUserId);
  }

  // Public: view available slots for next 7 days
  @Get("slotsavailable")
  async getAvailableSlots() {
    return this.slotService.getAvailableSlots();
  }

  @Post('test')
testBody(@Body() body: any) {
  console.log(body);
  return "This controller works";
}

}
