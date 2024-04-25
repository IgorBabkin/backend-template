import { Container, MetadataInjector, Tag } from 'ts-ioc-container';

export const createContainer = (...tags: Tag[]) => new Container(new MetadataInjector(), { tags });
