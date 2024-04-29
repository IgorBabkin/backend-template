import { accessor } from '../container/di';
import { RequestContext, RoutesPayloads } from '../../.generated/operations';

export interface IRequestContext extends RequestContext {
  tags: string[];
}

export const IRequestContextKey = accessor<IRequestContext>(Symbol('IRequestContext'));

export class AppRequestContext implements IRequestContext {
  tags: string[];

  constructor(private routes: Map<string, string>, public options: { tags: string[]; getBaseURI: () => string }) {
    this.tags = options.tags;
  }

  getUrl<Key extends keyof RoutesPayloads>(key: Key, payload: RoutesPayloads[Key]): string {
    const url = this.routes.get(key)!;
    return `${this.options.getBaseURI()}${this.addQuery(this.addParams(url, payload), payload)}`;
  }

  private addParams(url: string, payload: Record<string, unknown>) {
    if ('params' in payload) {
      const params = payload.params as Record<string, unknown>;
      return url.replace(/\{([^\\{].)*}/g, (v, key: string) => params[key] as string);
    }
    return url;
  }

  private addQuery(url: string, payload: Record<string, unknown>) {
    if ('query' in payload) {
      const query = payload.query as Record<string, unknown>;
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        params.append(key, String(value));
      }
      return `${url}?${params.toString()}`;
    }

    return url;
  }
}
