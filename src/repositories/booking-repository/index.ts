import { prisma } from '@/config';

async function findbooking(userId: number) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      Room: true,
    },
  });
}

const bookingRepository = {
  findbooking,
};

export default bookingRepository;
