import { DomainError } from './DomainError';

export class PersistenceError extends DomainError {
  name = 'PersistenceError';

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, PersistenceError.prototype);
  }
}
