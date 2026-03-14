import { graphql } from '../gql/gql';

export const GET_ALL_CHARACTERS = graphql(`
  query Characters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        next
        pages
        prev
      }
      results {
        id
        name
        image
        status
        species
      }
    }
  }
`);

export const GET_CHARACTER = graphql(`
  query Query($characterId: ID!) {
  character(id: $characterId) {
    id
    image
    name
    gender
    origin {
      name
    }
    location {
      name
    }
    status
    species
    episode {
      id
      name
      episode
    }
  }
}
`);
