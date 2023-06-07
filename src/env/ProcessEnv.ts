import { z } from 'zod';
import { IEnv, LogLevel } from './IEnv';

const schema = z.object({
  LOG_LEVEL: z.nativeEnum(LogLevel),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  NODE_ENV: z.string().optional(),
});

export class ProcessEnv implements IEnv {
  logLevel: LogLevel;
  port: number;
  production: boolean;

  constructor(data: unknown) {
    const { LOG_LEVEL, PORT, NODE_ENV } = schema.parse(data);
    this.logLevel = LOG_LEVEL;
    this.port = PORT;
    this.production = NODE_ENV === 'production';
  }
}
