import { ExpressServerBuilder } from './lib/express/ExpressServerBuilder';
import { RequestMediator, Scope } from '@ibabkin/ts-request-mediator';
import { RequestContainer } from './lib/requestMediator/container';
import { createContainer, disposeContainer } from './lib/container/di';
import { ProcessEnv } from './env/ProcessEnv';
import { Production } from './stages/Production';
import { Development } from './stages/Development';
import { Common } from './stages/Common';
import { bodyParsing, handleError, handleNotFound, logRequests, swaggerRoutes } from './lib/express/expressModules';
import { ExpressErrorHandler } from './errors/ExpressErrorHandler';
import { createLogger } from './domains/logger/ILogger';
import * as console from 'console';
import { AppMediator } from './lib/express/AppMediator';
import { Validator } from './lib/express/Validator';
import { PAYLOADS } from './.generated/validators';
import openapi from '../swagger.json';
import { OpenAPIV3 } from 'openapi-types';
import { operations } from './operations';

const env = new ProcessEnv(process.env);

const container = createContainer([Scope.Application])
  .add(new Common(env))
  .add(env.production ? new Production(env) : new Development(env));

const mediator = new RequestMediator(new RequestContainer(container));
const server = new ExpressServerBuilder(new AppMediator(operations(mediator)), new Validator(PAYLOADS))
  .addBuilderModule(swaggerRoutes(openapi as OpenAPIV3.Document))
  .addExpressModule(logRequests(createLogger('main')(container)))
  .addExpressModule(bodyParsing)
  .addExpressModule(handleError(container.resolve(ExpressErrorHandler)))
  .addExpressModule(handleNotFound)
  .build();

server.on('error', (error: Error) => {
  disposeContainer(container).catch((e) => console.error('disposeContainer', e));

  if (error.name !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.message) {
    case 'EACCES':
      console.error(`Pipe ${env.port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Pipe ${env.port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.listen(env.port, () => {
  console.log(`Listening on ${env.port}`);
});
