import { ExpressServerBuilder } from './lib/express/ExpressServerBuilder';
import { RequestMediator, Scope } from 'ts-request-mediator';
import { createContainer, disposeContainer } from './lib/container/di';
import { ProcessEnv } from './env/ProcessEnv';
import { Production } from './stages/Production';
import { Development } from './stages/Development';
import { Common } from './stages/Common';
import { bodyParsing, handleError, handleNotFound, logRequests, openapiRoutes } from './lib/express/expressModules';
import { createLogger } from './domains/logger/ILogger';
import * as console from 'console';
import { PAYLOADS } from './.generated/validators';
import openapi from './.generated/swagger.json';
import { OpenAPIV3 } from 'openapi-types';
import { operations } from './operations';
import * as process from 'process';
import { DomainErrorHandler } from './useCase/errorHandler/DomainErrorHandler';
import { RequestContainer } from './lib/container/RequestContainer';

const env = new ProcessEnv(process.env);

const container = createContainer(Scope.Application)
  .use(new Common())
  .use(process.env.NODE_ENV === 'production' ? new Production(env) : new Development(env));

const mediator = new RequestMediator(new RequestContainer(container));
const server = new ExpressServerBuilder(operations(mediator), PAYLOADS)
  .addBuilderModule(openapiRoutes(openapi as OpenAPIV3.Document))
  .addExpressModule(logRequests(createLogger('main')(container)))
  .addExpressModule(bodyParsing)
  .addExpressModule(handleError(container.resolve(DomainErrorHandler)))
  .addExpressModule(handleNotFound)
  .build();

server.on('error', (error: Error) => {
  disposeContainer(container)
    .catch((e) => console.error('disposeContainer', e))
    .finally(() => container.dispose());

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
