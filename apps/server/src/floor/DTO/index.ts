import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class FloorDTO {
  @IsString()
  @ValidateIf((object, value) => value !== null)
  previous_floor_id: string | null;
}

export class FloorUpdateDTO {
  @IsUUID()
  id: string;

  @IsNumber()
  newLevel: number;
}
