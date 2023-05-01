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
  });
}

// async function findBookingId(bookingId: number) {
//   return prisma.booking.findFirst({
//     where: {
//       id: bookingId,
//     },
//   });
// }

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
  });
}

async function upadateBooking(userId: number, roomId: number) {
  return prisma.booking.upsert({
    where: {
      id: userId,
    },
    update: {
      roomId,
    },
    create: {
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
  //  findBookingId,
};

export default bookingRepository;
