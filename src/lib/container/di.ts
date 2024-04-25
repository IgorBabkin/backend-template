import { by, Container, DependencyKey, key, MetadataInjector, Tag } from 'ts-ioc-container';

export const createContainer = (...tags: Tag[]) => new Container(new MetadataInjector(), { tags });

export function accessor<T>(token: DependencyKey) {
  return {
    register: key(token),
    key: token,
    resolve: by.key<T>(token),
  };
}
