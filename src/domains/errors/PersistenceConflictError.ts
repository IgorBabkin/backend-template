import { DomainError } from './DomainError';

export class PersistenceConflictError extends DomainError {
  name = 'PersistenceConflictError';

  constructor(message: string) {
    super(`PersistenceConflictError: ${message}`);

    Object.setPrototypeOf(this, PersistenceConflictError.prototype);
  }
}
