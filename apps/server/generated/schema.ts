export interface Building {
  id: string;
  name: string;
  user_id: string;
}
export interface Booking {
  id: string;
  interval: [Date, Date];
  space_id: string;
  user_id: string;
}
export interface Space {
  id: string;
  name: string;
  x: number;
  y: number;
  floor_id: string;
}
export interface Floor {
  id: string;
  level: number;
  building_id: string;
}
export interface User {
  id: string;
  name: string;
  password: string;
  admin: boolean;
}
