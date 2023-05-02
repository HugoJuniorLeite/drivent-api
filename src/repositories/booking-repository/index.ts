import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function findRoomId(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

async function isBooking(bookingId: number, userId: number /*, roomId: number*/) {
  return prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
      //     roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
  });
}

async function upadateBooking(userId: number, roomId: number, bookingId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      userId,
      roomId,
    },
  });
}

const bookingRepository = {
  findBooking,
  createBooking,
  findRoomId,
  upadateBooking,
  isBooking,
};

export default bookingRepository;
