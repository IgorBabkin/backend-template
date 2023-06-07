import { DomainError } from './DomainError';

export class EntityNotFoundError extends DomainError {
  name = 'EntityNotFoundError';

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}
