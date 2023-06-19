import { Resolver } from '../../lib/container/di';
import { response, Response } from 'express';

export interface IResponse {
  sendError(statusCode: number, error: unknown): void;
}

export const IResponseKey = Symbol('IResponse');
export const responseFactory: Resolver<(response: Response) => IResponse> = (c) => c.resolve(IResponseKey, response);
