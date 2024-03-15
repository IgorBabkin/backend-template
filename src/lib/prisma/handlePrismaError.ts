import { PersistenceConflictError } from '../../domains/errors/PersistenceConflictError';
import { errorToString } from '../../domains/errors/DomainError';
import { EntityNotFoundError } from '../../domains/errors/EntityNotFoundError';
import { PersistenceError } from '../../domains/errors/PersistenceError';
import { UnknownError } from '../../domains/errors/UnknownError';
import { Prisma } from '@prisma/client';
import { handleAsyncError } from '@ibabkin/utils';

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
