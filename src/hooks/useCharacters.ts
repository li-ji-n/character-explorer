import { useInfiniteQuery } from '@tanstack/react-query';
import { gqlFetcher } from '../api/client';
import { GET_ALL_CHARACTERS } from '../api/queries';

export function useCharacters(search: string, status: string) {
  return useInfiniteQuery({
    queryKey: ['characters', search, status],
    queryFn: ({ pageParam }) =>
      gqlFetcher(GET_ALL_CHARACTERS, {
        page: pageParam,
        filter: {
          name: search || undefined,
          status: status !== 'All' ? status : undefined,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.characters?.info?.next ?? undefined,
  });
}
