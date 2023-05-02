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
    throw notFoundError();
  }
  if (room.capacity <= room.Booking.length) {
    throw forbiddenBookingError();
  }
  //  const result = await bookingRepository.findBooking(userId);

  const booking = await bookingRepository.createBooking(userId, roomId);
  if (!booking) throw notFoundError();

  const bookingId = { bookingId: booking.id };

  return bookingId;
}

async function upadateBooking(userId: number, roomId: number, bookingId: number) {
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
    throw notFoundError();
  }
  if (room.capacity <= room.Booking.length) {
    throw forbiddenBookingError();
  }

  const isBooking = await bookingRepository.isBooking(bookingId, userId);
  if (!isBooking) throw forbiddenBookingError();

  const booking = await bookingRepository.upadateBooking(userId, roomId, bookingId);
  if (!booking) throw notFoundError();

  const result = { bookingId: booking.id };

  return result;
}

const bookingService = { getBooking, createBooking, upadateBooking };

export default bookingService;
