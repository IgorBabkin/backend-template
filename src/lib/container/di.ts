import { Container, provider, singleton, Tag, tags } from 'ts-ioc-container';
import { Scope } from 'ts-request-mediator';
import { DependencyInjector } from './DependencyInjector';

export const createContainer = (...tags: Tag[]) => new Container(new DependencyInjector(), { tags });

export const perApplication = provider(singleton(), tags(Scope.Application));
export const perRequest = provider(singleton(), tags(Scope.Request));
export const perUseCase = provider(singleton(), tags(Scope.UseCase));
export const perService = provider(singleton(), tags(Scope.Service));
export const asSingleton = provider(singleton());
