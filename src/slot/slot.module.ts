import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { Slot } from './slot.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, User])],
  providers: [SlotService],
  controllers: [SlotController],
})
export class SlotModule {}
