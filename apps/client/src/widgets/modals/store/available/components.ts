import { bookingModalName } from '../../components/Booking/booking.slice';

const popups = [bookingModalName] as const;

export type Components = typeof popups[number];
