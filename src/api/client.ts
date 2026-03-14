import { QueryClient } from '@tanstack/react-query';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';

const GQL_ENDPOINT = 'https://rickandmortyapi.com/graphql';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      gcTime: 10 * 60 * 1000, // 10 min
      retry: (failureCount, error) => {
        if (error.message.includes('429')) return failureCount < 5;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

const printCache = new WeakMap<object, string>();
function printOnce(doc: TypedDocumentNode<any, any>): string {
  if (!printCache.has(doc)) printCache.set(doc, print(doc));
  return printCache.get(doc)!;
}


export async function gqlFetcher<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
): Promise<TData> {
  const response = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: printOnce(document),
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json() as { data?: TData; errors?: { message: string }[] };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'));
  }

  return json.data as TData;
}
