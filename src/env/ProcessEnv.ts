import { z } from 'zod';
import { IEnv, LogLevel } from './IEnv';
import { zNumber } from '../lib/zod/utils';

const schema = z.object({
  LOG_LEVEL: z.nativeEnum(LogLevel),
  PORT: zNumber,
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
