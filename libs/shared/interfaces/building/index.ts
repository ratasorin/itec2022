import { Floor } from '@prisma/client';

export interface SpacesOnFloor {
  space_id: string;
  x: number;
  y: number;
  occupantName: string | null;
  officeName: string;
  book_until: string | null;
}

export interface Building {
  name: string;
  id: number;
  floors: Floor[];
}
