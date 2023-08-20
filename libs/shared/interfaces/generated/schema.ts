export interface BuildingDB {
  id: string;
  name: string;
  user_id: string;
}
export interface BookingDB {
  id: string;
  interval: [Date, Date];
  office_id: string;
  user_id: string;
}
export interface OfficeDB {
  id: string;
  name: string;
  x: number;
  y: number;
  floor_id: string;
}
export interface FloorDB {
  id: string;
  previous_floor_id: string;
  building_id: string;
}
export interface UserDB {
  id: string;
  email: string;
  name: string;
  password: string;
  admin: boolean;
}
