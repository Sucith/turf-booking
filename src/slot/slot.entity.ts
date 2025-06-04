// src/slot/slot.entity.ts
import {
  Entity,PrimaryGeneratedColumn,  Column, ManyToOne,  CreateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD format

  @Column({ type: 'time' })
  startTime: string; // e.g. '10:00:00'

  @Column({ type: 'time' })
  endTime: string;

  @Column({ default: false })
  isBooked: boolean;

  // Admin user who created the slot
  @ManyToOne(() => User, (user) => user.createdSlots, { nullable: false })
  createdBy: User;

  // User who booked the slot (nullable)
  @ManyToOne(() => User, (user) => user.bookedSlots, { nullable: true })
  bookedBy: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
