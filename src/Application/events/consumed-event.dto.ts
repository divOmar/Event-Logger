





import {
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsString
} from "class-validator";

export class ConsumedEventDto {
  @IsString()
  @IsNotEmpty()
  _id!: string;

  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsObject()
  payload!: Record<string, unknown>;

  @IsISO8601()
  createdAt!: string;
}