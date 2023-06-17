import { handleAsyncError } from 'ts-constructor-injector';
import { PersistenceConflictError } from './PersistenceConflictError';
import { errorToString } from './DomainError';
import { EntityNotFoundError } from './EntityNotFoundError';
import { PersistenceError } from './PersistenceError';
import { UnknownError } from './UnknownError';
import { Prisma } from '@prisma/client';

export const handlePrismaError = handleAsyncError((error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new PersistenceConflictError(errorToString(error));
      case 'P2025':
        throw new EntityNotFoundError(errorToString(error));
      default:
        throw new PersistenceError(errorToString(error));
    }
  }

  throw new UnknownError(errorToString(error));
});
