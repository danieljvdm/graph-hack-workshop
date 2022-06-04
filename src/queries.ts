import {
  gql
} from '@apollo/client';

export const tokensQuery = gql`
  query WalletTokens($ensName: String!) {
    wallet(ensName: $ensName) {
      ensName
      address
      tokens {
        edges {
          node {
            tokenId
            ... on ERC721Token {
              contract {
                address
                ... on ERC721Contract {
                  symbol
                  name
                }
              }
              ... on ERC721Token {
                images {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const collectionStatsQuery = gql`
  query CollectionStats($address: String!, $timeRange: DateInputType) {
    contract(address: $address) {
      ... on ERC721Contract {
        address
        stats(timeRange: $timeRange) {
          floor
          volume
        }
      }
    }
  }
`;
