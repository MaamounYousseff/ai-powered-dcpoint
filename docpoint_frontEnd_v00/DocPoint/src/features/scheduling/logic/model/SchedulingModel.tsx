import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  Min
} from "class-validator";
import "reflect-metadata";

export class SchedulingModel {

  @IsNotEmpty({ message: "First name should not be empty" })
  @Length(2, 50, { message: "First name must be between 2 and 50 characters" })
  firstName!: string;

  @IsNotEmpty({ message: "Last name should not be empty" })
  @Length(2, 50, { message: "Last name must be between 2 and 50 characters" })
  lastName!: string;

  @IsNotEmpty({ message: "Phone number should not be empty" })
  @Length(8,8, { message: "Phone number must be 7 characters" })
  phoneNumber!: string;

  @IsOptional()
  @Length(8,8, { message: "Second phone number must be 7 characters" })
  phoneNumber2!: string;

  @IsNotEmpty({ message: "Date should not be empty" })
  datetime!: Date;

  @IsNotEmpty({ message: "Appointment type should not be empty" })
  appointmentType!: string;

  @IsNotEmpty({ message: "Duration should not be empty" })
  duration!: string;

  @IsNotEmpty({ message: "Fees should not be empty" })
  @Min(0, { message: "Fees cannot be negative" })
  fees!: number;

  @IsOptional()
  @IsString({ message: "Notes must be a string" })
  notes!: string;

}