import { constructor } from '@ibabkin/ts-constructor-injector';
import { IExpressRoute } from './IExpressRoute';

export interface IServerBuilder {
  addRoute(Route: constructor<IExpressRoute>): this;
}
