import { z } from 'zod';
import { IEnv, LogLevel } from './IEnv';
import { zNumber } from '../lib/zod/utils';

const schema = z.object({
  LOG_LEVEL: z.nativeEnum(LogLevel),
  PORT: zNumber,
});

export class ProcessEnv implements IEnv {
  logLevel: LogLevel;
  port: number;

  constructor(data: unknown) {
    const { LOG_LEVEL, PORT } = schema.parse(data);
    this.logLevel = LOG_LEVEL;
    this.port = PORT;
  }
}
