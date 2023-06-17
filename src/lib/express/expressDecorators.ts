import { composeDecorators, constructor, getProp, prop } from 'ts-constructor-injector';
import { IExpressRoute } from './IExpressRoute';

type HttpMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

const httpMethod = (method: HttpMethod) => prop('httpMethod', method);
const httpUrl = (url: string) => prop('httpUrl', url);

type HttpRoute = { method: HttpMethod; url: string };

function getHttpMethod(target: constructor<IExpressRoute>): HttpMethod {
  const method = getProp<HttpMethod>(target, 'httpMethod');
  if (!method) {
    throw new Error('HttpMethod is not defined');
  }
  return method;
}

function getHttpUrl(target: constructor<IExpressRoute>): string {
  const url = getProp<string>(target, 'httpUrl');
  if (!url) {
    throw new Error('HttpUrl is not defined');
  }
  return url;
}

export function getRoute(target: constructor<IExpressRoute>): HttpRoute {
  return {
    method: getHttpMethod(target),
    url: getHttpUrl(target),
  };
}

const route =
  (method: HttpMethod) =>
  (url: string): ClassDecorator =>
    composeDecorators(httpMethod(method), httpUrl(url));

export const POST = route('post');
export const GET = route('get');
export const PATCH = route('patch');
export const DELETE = route('delete');
export const PUT = route('put');
