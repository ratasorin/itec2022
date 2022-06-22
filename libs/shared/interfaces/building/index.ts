export interface SpacesOnFloor {
  space_id: string;
  x: number;
  y: number;
  occupantName: string | null;
  officeName: string;
  booked_until: string | null;
}
