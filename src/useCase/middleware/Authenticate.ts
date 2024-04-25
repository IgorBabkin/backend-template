import { IMiddleware } from '../../lib/mediator/IQueryHandler';
import { register, scope } from 'ts-ioc-container';
import * as console from 'node:console';
import { perScope } from '../../lib/mediator/Scope';
import { asMiddleware } from '../../lib/mediator/Middleware';

@register(scope(perScope.Request))
@asMiddleware('middleware-before', 'admins')
export class Authenticate implements IMiddleware {
  async handle(): Promise<void> {
    console.log('Authenticate middleware');
  }
}
