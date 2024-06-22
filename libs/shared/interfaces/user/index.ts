import { buildings, users } from '../generated/schema';

export interface UserDB extends Omit<users, 'password' | 'admin'> {}
export interface UserDTO {
  name: string;
  password: string;
  email: string;
}

export interface i_BuildingOwnedByUser extends buildings {
  bookings_count: string;
  active_bookings_count: string;
  avg_rating: string;
}
