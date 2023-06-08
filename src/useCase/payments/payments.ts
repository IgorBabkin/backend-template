import { IServerBuilder } from '../../lib/express/IServerBuilder';
import { CreatePaymentHttpRoute } from './CreatePaymentHttpRoute';
import { GetPaymentHttpRoute } from './GetPaymentHttpRoute';

export function payments(builder: IServerBuilder) {
  builder.addRoute(CreatePaymentHttpRoute).addRoute(GetPaymentHttpRoute);
}
