import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from 'src/auth/enums/roles.enums';
import { Slot } from 'src/slot/slot.entity'; // 👈 import the Slot entity

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phnum: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToMany(() => Slot, (slot) => slot.createdBy)
  slots: Slot[]; // 👈 this sets up the one-to-many relationship

  @OneToMany(() => Slot, (slot) => slot.createdBy)
createdSlots: Slot[];

@OneToMany(() => Slot, (slot) => slot.bookedBy)
bookedSlots: Slot[];
}
