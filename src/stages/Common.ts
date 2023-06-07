import { IContainer, IContainerModule } from '@ibabkin/ts-ioc-container';
import { IEnv } from '../env/IEnv';

export class Common implements IContainerModule {
  constructor(env: IEnv) {}

  applyTo(container: IContainer): void {}
}
