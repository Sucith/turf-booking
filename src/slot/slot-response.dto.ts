import { User } from 'src/user/user.entity';

export class SlotResponseDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedById: number | null;
  bookedBy: {
    id: number;
    username: string;
    email: string;
    role: string;
  } | null;

  constructor(slot: {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    bookedById?: number | null;
    bookedBy: User | null;
  }) {
    this.id = slot.id;
    this.date = slot.date;
    this.startTime = slot.startTime;
    this.endTime = slot.endTime;
    this.isBooked = slot.isBooked;

    // ✅ Prefer explicit bookedById if available
    this.bookedById = slot.bookedById ?? (slot.bookedBy ? slot.bookedBy.id : null);

    this.bookedBy = slot.bookedBy
      ? {
          id: slot.bookedBy.id,
          username: slot.bookedBy.username,
          email: slot.bookedBy.email,
          role: slot.bookedBy.role,
        }
      : null;
  }
}
