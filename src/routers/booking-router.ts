import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createBooking, getBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBooking).post('/', createBooking);

export { bookingRouter };
