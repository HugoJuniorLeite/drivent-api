import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
//import hotelsService from '@/services/hotels-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const getBooking = await bookingService.getBooking(userId);
    //  return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}
