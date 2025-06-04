// src/slot/slot.service.ts
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from './slot.entity';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Create multiple slots for next 7 days
  async createSlots(
    slotsData: {
      date: string;
      startTime: string;
      endTime: string;
    }[],
    adminUserId: number,
  ): Promise<Slot[]> {
    const adminUser = await this.userRepository.findOneBy({ id: adminUserId });
    if (!adminUser) {
      throw new BadRequestException('Admin user not found');
    }
    if (adminUser.role !== 'admin') {
      throw new ForbiddenException('Only admins can create slots');
    }

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    // Validate all slots are within next 7 days
    for (const slot of slotsData) {
      const slotDate = new Date(slot.date);
      if (slotDate < today || slotDate > maxDate) {
        throw new BadRequestException(
          `Slot date ${slot.date} is not within the next 7 days`,
        );
      }
      // Additional validation: startTime < endTime can be done here
    }

    // Optional: check for overlapping slots on the same date/time

    const slots: Slot[] = [];

    for (const slotData of slotsData) {
      const slot = this.slotRepository.create({
        date: slotData.date,
        startTime: slotData.startTime,
        endTime: slotData.endTime,
        createdBy: adminUser,
        isBooked: false,
      });
      slots.push(slot);
    }

    return this.slotRepository.save(slots);
  }

  // Get all available slots for next 7 days (not booked)
  async getAvailableSlots(): Promise<Slot[]> {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    return this.slotRepository.find({
      where: {
        date: Between(today.toISOString().slice(0, 10), maxDate.toISOString().slice(0, 10)),
        isBooked: false,
      },
      // relations: ['createdBy'],
      // order: {
      //   date: 'ASC',
      //   startTime: 'ASC',
      // },
    });
  }
}
