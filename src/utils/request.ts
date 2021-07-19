import fetch from 'unfetch';
import qs from 'query-string';

export async function get(url: string, query: Record<string, any>) {
  if (query) {
    url += '?' + qs.stringify(query);
  }
  return await (await fetch(url)).json();
}

export function subgraph(subgraphUrl: string) {
  return async function (query: string, variables: Record<string, any>) {
    const res = await fetch(subgraphUrl, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    });
    const { data } = await res.json();
    return data;
  };
}
