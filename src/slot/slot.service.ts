import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './slot.entity';
import { User } from 'src/user/user.entity';
import { CreateSlotDto } from './create-slot.dto';
import { SlotResponseDto } from './slot-response.dto';
import dayjs from 'dayjs';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
  ) {}

  async createSlot(createSlotDto: CreateSlotDto): Promise<SlotResponseDto> {
    const { date, startTime, endTime } = createSlotDto;

    const today = dayjs().startOf('day');
    const slotDate = dayjs(date, 'YYYY-MM-DD');

    if (slotDate.isBefore(today)) {
      throw new BadRequestException('Cannot create a slot for a past date');
    }

    // Optional: Enforce 5-day rule
    const maxAllowed = dayjs().add(5, 'day').endOf('day');
    if (slotDate.isAfter(maxAllowed)) {
      throw new BadRequestException('Slots can only be created for the next 5 days');
    }

    const slot = this.slotRepository.create({
      date,
      startTime,
      endTime,
      isBooked: false,
      bookedBy: null,
    });

    const savedSlot = await this.slotRepository.save(slot);
    return new SlotResponseDto(savedSlot);
  }

  async bookSlot(slotId: number, user: User): Promise<Slot> {
  const slot = await this.slotRepository.findOne({
    where: { id: slotId },
    relations: ['bookedBy'],
  });

  if (!slot) {
    throw new NotFoundException('Slot not found');
  }

  if (slot.isBooked) {
    throw new BadRequestException('Slot already booked');
  }

  slot.isBooked = true;
  slot.bookedBy = user;

  await this.slotRepository.save(slot);

  // ✅ Reload the slot to get the updated bookedById
  const updatedSlot = await this.slotRepository.findOne({
    where: { id: slot.id },
    relations: ['bookedBy'],
  });

  return updatedSlot!;
}

  async cancelBooking(slotId: number, user: User): Promise<SlotResponseDto> {
    const slot = await this.slotRepository.findOne({
      where: { id: slotId },
      relations: ['bookedBy'],
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (!slot.isBooked || slot.bookedBy?.id !== user.id) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    slot.isBooked = false;
    slot.bookedBy = null;

    const cancelledSlot = await this.slotRepository.save(slot);
    return new SlotResponseDto(cancelledSlot);
  }

  async getAvailableSlots(): Promise<SlotResponseDto[]> {
    const slots = await this.slotRepository.find({
      where: { isBooked: false },
      relations: ['bookedBy'],
    });

    return slots.map((slot) => new SlotResponseDto(slot));
  }
}
