import { prisma } from '@/config';

async function findBooking(userId: number) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      Room: true,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
  });
}

const bookingRepository = {
  findBooking,
  createBooking,
};

export default bookingRepository;
