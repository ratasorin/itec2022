import { buildings, users } from '../generated/schema';

export interface UserDTO extends Omit<users, 'id' | 'admin'> {}

export interface i_BuildingOwnedByUser extends buildings {}
