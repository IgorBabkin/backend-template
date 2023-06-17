import { IContainer, IContainerModule, Registration } from 'ts-ioc-container';
import { IEnv } from '../env/IEnv';
import { PaymentRepo } from '../domains/payments/PaymentRepo';

export class Common implements IContainerModule {
  constructor(env: IEnv) {}

  applyTo(container: IContainer): void {
    container.add(Registration.fromClass(PaymentRepo));
  }
}
