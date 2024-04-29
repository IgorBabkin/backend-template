import { ExpressServerBuilder } from './lib/express/ExpressServerBuilder';
import { createContainer } from './lib/container/di';
import { ProcessEnv } from './env/ProcessEnv';
import { Production } from './stages/Production';
import { Development } from './stages/Development';
import { Common } from './stages/Common';
import { bodyParsing, CORS, handleNotFound } from './lib/express/modules/expressModules';
import { PAYLOADS } from './.generated/validators';
import openapi from './.generated/swagger.json';
import { OpenAPIV3 } from 'openapi-types';
import { operations } from './operations';
import { DomainErrorHandler } from './lib/express/errorHandler/DomainErrorHandler';
import { OpenAPIRoutes } from './lib/express/modules/OpenAPIRoutes';
import { RequestLogger } from './lib/express/modules/RequestLogger';
import { DisposeInstances } from './useCase/middleware/DisposeInstances';
import { Scope } from './lib/components/Scope';
import { RouteMediator } from './lib/express/modules/RouteMediator';

const env = ProcessEnv.parse(process.env);

const appScope = createContainer(Scope.Application)
  .use(new Common())
  .use(process.env.NODE_ENV === 'production' ? new Production(env) : new Development(env));

const server = new ExpressServerBuilder()
  .addExpressModule(CORS)
  .addExpressModule(bodyParsing)
  .useModule(new OpenAPIRoutes(openapi as OpenAPIV3.Document, new RouteMediator(operations, PAYLOADS, appScope)))
  .useModule(appScope.resolve(DomainErrorHandler))
  .useModule(appScope.resolve(RequestLogger))
  .addExpressModule(handleNotFound)
  .build();

server.on('error', (error: Error) => {
  appScope
    .resolve(DisposeInstances)
    .handle()
    .catch((e) => console.error('disposeContainer', e))
    .finally(() => appScope.dispose());

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
