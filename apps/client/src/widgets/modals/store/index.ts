import booking, { bookingModalName } from '../components/Booking/booking.slice';

const modalsReducer = {
  [bookingModalName]: booking,
};

export default modalsReducer;
