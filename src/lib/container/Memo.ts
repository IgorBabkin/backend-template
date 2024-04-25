import { DependencyKey, IContainer } from 'ts-ioc-container';
import { AliasPredicate } from 'ts-ioc-container/typings/container/IContainer';
import { accessor } from './di';

export type IAliasMemo = Map<string, DependencyKey[]>;
export const IAliasMemoKey = accessor<Map<string, DependencyKey[]>>(Symbol('IAliasMemo'));

export const byAliasesMemoized = (predicate: AliasPredicate, memoKey: string) => (s: IContainer) => {
  const memo = IAliasMemoKey.resolve(s);
  if (memo.has(memoKey)) {
    return memo.get(memoKey)!.map((key) => s.resolve(key));
  }

  const result = s.resolveManyByAlias(predicate);
  memo.set(memoKey, Array.from(result.keys()));
  return Array.from(result.values());
};
