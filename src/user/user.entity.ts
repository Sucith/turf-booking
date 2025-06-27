import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Slot } from 'src/slot/slot.entity';
import { Role } from 'src/auth/enums/roles.enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phnum?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToMany(() => Slot, (slot) => slot.bookedBy)
  bookedSlots: Slot[];
}
