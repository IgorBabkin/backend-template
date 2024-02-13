import { z } from 'zod';
import { IEnv, LogLevel } from './IEnv';
import { zNumber } from '../lib/zod/utils';

const schema = z.object({
  LOG_LEVEL: z.nativeEnum(LogLevel),
  PORT: zNumber,
});

export class ProcessEnv implements IEnv {
  static fromEnv(data: unknown): ProcessEnv {
    const { LOG_LEVEL, PORT } = schema.parse(data);
    return new ProcessEnv(LOG_LEVEL, PORT);
  }

  constructor(public logLevel: LogLevel, public port: number) {}
}
