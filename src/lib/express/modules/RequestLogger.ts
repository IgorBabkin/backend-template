import { IServerBuilder, IServerBuilderModule } from '../IServerBuilder';
import { inject } from 'ts-ioc-container';
import { createLogger, ILogger } from '../../../domains/logger/ILogger';

export class RequestLogger implements IServerBuilderModule {
  constructor(@inject(createLogger('RequestLogger')) private logger: ILogger) {}

  applyTo(builder: IServerBuilder): void {
    builder.addExpressModule((app) => {
      app.use((req, res, next) => {
        this.logger.http('processing request', { url: req.originalUrl, body: req.body });
        next();
      });
    });
  }
}
