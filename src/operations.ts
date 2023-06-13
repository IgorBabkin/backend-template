import { IMediator } from '@ibabkin/ts-request-mediator';
import { Operations } from './.generated/operations';
import { payments } from './useCase/payments/payments';

export function operations(mediator: IMediator): Operations {
  return {
    ...payments(mediator),
  };
}
