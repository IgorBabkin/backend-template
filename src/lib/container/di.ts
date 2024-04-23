import { Container, IContainer, MetadataInjector, provider, singleton, Tag } from 'ts-ioc-container';
import { byAliasesMemoized } from './Memo';

export const createContainer = (...tags: Tag[]) => new Container(new MetadataInjector(), { tags });

export const asSingleton = provider(singleton());

const tagged =
  (...tags: string[]) =>
  (p: Set<string>) =>
    tags.every(p.has);

export const byAliases =
  (prefixAliases: string[], getContextAliases?: (s: IContainer) => string[]) => (s: IContainer) => {
    if (!getContextAliases) {
      const memoKey = prefixAliases.join(',');
      return byAliasesMemoized(tagged(...prefixAliases), memoKey)(s);
    }
    const contextAliases = getContextAliases(s);
    if (contextAliases.length === 0) {
      return [];
    }
    const memoKey = prefixAliases.concat(contextAliases).join(',');
    return byAliasesMemoized(tagged(...prefixAliases, ...contextAliases), memoKey)(s);
  };
