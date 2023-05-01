import { notFoundError, unauthorizedError } from '@/errors';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { exclude } from '@/utils/prisma-utils';

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
  const booking = await bookingRepository.findBooking(userId);
  if (booking.length === 0) throw notFoundError();

  //  return {...exclude(booking, 'userId', 'roomId', 'createdAt', 'updatedAt')};

  return { booking };
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
  const booking = await bookingRepository.createBooking(userId, roomId);
  if (!booking) throw notFoundError();

  return booking;
}

export default { getBooking, createBooking };
