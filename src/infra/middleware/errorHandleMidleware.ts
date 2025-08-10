import { isProduction } from '@/config/env';
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    const payload: any = {
      status: 'error',
      message: err.message,
    };
    if (!isProduction) payload.stack = err.stack;
    return res.status(err.statusCode).json(payload);
  }

  console.error('💥 Erro não tratado:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
    stack: !isProduction ? err.stack : undefined,
  });
}
