import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  const { userId } = req;

  try {
    const getBooking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(getBooking);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    // if (!userId || !roomId) return res.sendStatus(httpStatus.BAD_REQUEST);

    const booking = await bookingService.createBooking(userId, roomId);
    if (!booking) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    next(error);
    // return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  try {
    // if (!userId || !roomId) return res.sendStatus(httpStatus.BAD_REQUEST);

    const booking = await bookingService.upadateBooking(userId, roomId, bookingId);
    if (!booking) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    next(error);
    // return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
