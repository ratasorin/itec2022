import { IsString, ValidateIf } from 'class-validator';

export class FloorDTO {
  @IsString()
  @ValidateIf((object, value) => value !== null)
  previous_floor_id: string | null;
}
