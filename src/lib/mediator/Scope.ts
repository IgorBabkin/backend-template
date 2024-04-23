import { Tagged } from 'ts-ioc-container';

export enum Scope {
  Application = 'Application',
  Request = 'Request',
}

export const perScope = {
  Application: (s: Tagged) => s.hasTag(Scope.Application),
  Request: (s: Tagged) => s.hasTag(Scope.Request),
};
