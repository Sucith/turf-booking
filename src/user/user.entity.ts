// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from 'src/auth/enums/roles.enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false }) // 👈 this is essential!
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phnum: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
}
