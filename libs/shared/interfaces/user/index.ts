import { UserDB } from '@shared';
export interface UserDTO extends Omit<UserDB, 'id' | 'admin'> {}
