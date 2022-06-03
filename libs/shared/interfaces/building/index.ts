import { Floor } from '@prisma/client';

export interface SpacesOnLevel {
  space_id: number | null;
  x: number;
  y: number;
  name: string | null;
  book_until: string | null;
}

export interface Building {
  name: string;
  id: number;
  floors: Floor[];
}
