import { AppError } from './AppError.ts';

export class ConflictError extends AppError {
  constructor(message = 'Data bentrok dengan yang sudah ada') {
    super(409, message);
    this.name = 'ConflictError';
  }
}