import { Floor } from '@prisma/client';

export interface RetrievedSpaces {
  book_until: Date | undefined;
  id: number;
  x: number;
  y: number;
}

export interface Building {
  name: string;
  id: number;
  floors: Floor[];
}
