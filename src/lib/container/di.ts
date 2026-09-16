import { Container, Tag } from 'ts-ioc-container';

export const createContainer = (...tags: Tag[]) => new Container({ tags });
