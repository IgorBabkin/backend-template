import { Container, IContainer, MetadataInjector, Tag } from 'ts-ioc-container';
import { byAliasesMemoized } from './Memo';
import { AliasPredicate } from 'ts-ioc-container/typings/container/IContainer';

export const createContainer = (...tags: Tag[]) => new Container(new MetadataInjector(), { tags });

const tagged =
  (...tags: string[]): AliasPredicate =>
  (p) =>
    tags.every((t) => p.has(t));

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
