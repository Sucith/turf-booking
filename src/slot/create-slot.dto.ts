import { IsNotEmpty, IsDateString, Matches } from 'class-validator';

export class CreateSlotDto {
  @IsNotEmpty()
  @IsDateString({}, { message: 'date must be a valid ISO date string (YYYY-MM-DD)' })
  date: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm 24-hour format',
  })
  startTime: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm 24-hour format',
  })
  endTime: string;
}
