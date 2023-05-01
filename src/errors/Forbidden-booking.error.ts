import { ApplicationError } from '@/protocols';

export function forbiddenBookingError(): ApplicationError {
  return {
    name: 'ForbiddenBookingError',
    message: 'you don’t have permission to access this resource',
  };
}
