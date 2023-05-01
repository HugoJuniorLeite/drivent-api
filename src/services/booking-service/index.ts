import { Booking, Room } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { forbiddenBookingError } from '@/errors/Forbidden-booking.error';

async function getBooking(userId: number): Promise<Booking> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenBookingError();
  }
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) throw notFoundError();

  //  return {...exclude(booking, 'userId', 'roomId', 'createdAt', 'updatedAt')};

  return booking;
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenBookingError();
  }

  const room = await bookingRepository.findRoomId(roomId);
  if (!room) {
    throw forbiddenBookingError();
  }
  if (room.capacity === 0) {
    throw forbiddenBookingError();
  }

  //  const result = await bookingRepository.findBooking(userId);

  const booking = await bookingRepository.createBooking(userId, roomId);
  if (!booking) throw notFoundError();

  return booking.id;
}

const bookingService = { getBooking, createBooking };

export default bookingService;
