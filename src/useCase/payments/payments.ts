import { IServerBuilder } from '../../lib/express/IServerBuilder';
import { CreatePaymentHttpRoute } from './CreatePaymentHttpRoute';

export function payments(builder: IServerBuilder) {
  builder.addRoute(CreatePaymentHttpRoute);
}
