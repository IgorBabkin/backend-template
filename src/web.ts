import { ExpressServerBuilder } from './lib/express/ExpressServerBuilder';
import { Scope } from 'ts-request-mediator';
import { createContainer } from './lib/container/di';
import { ProcessEnv } from './env/ProcessEnv';
import { Production } from './stages/Production';
import { Development } from './stages/Development';
import { Common } from './stages/Common';
import { bodyParsing, handleNotFound } from './lib/express/modules/expressModules';
import { PAYLOADS } from './.generated/validators';
import openapi from './.generated/swagger.json';
import { OpenAPIV3 } from 'openapi-types';
import { operations } from './operations';
import { DomainErrorHandler } from './useCase/errorHandler/DomainErrorHandler';
import { OpenAPIRoutes } from './lib/express/modules/OpenAPIRoutes';
import { RequestLogger } from './lib/express/modules/RequestLogger';
import { DisposeInstances } from './useCase/DisposeInstances';

const env = ProcessEnv.parse(process.env);

const container = createContainer(Scope.Application)
  .use(new Common())
  .use(process.env.NODE_ENV === 'production' ? new Production(env) : new Development(env));

const server = new ExpressServerBuilder()
  .useModule(new OpenAPIRoutes(openapi as OpenAPIV3.Document, operations(container), PAYLOADS))
  .useModule(container.resolve(DomainErrorHandler))
  .useModule(container.resolve(RequestLogger))
  .addExpressModule(bodyParsing)
  .addExpressModule(handleNotFound)
  .build();

server.on('error', (error: Error) => {
  container
    .resolve(DisposeInstances)
    .handle()
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
