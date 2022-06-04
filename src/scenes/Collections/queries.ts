import {
  gql
} from '@apollo/client';

export const trendingCollectionsQuery = gql`
  query TrendingCollections {
    contracts(orderBy: SALES, orderDirection: DESC) {
      edges {
        node {
          address
          ... on ERC721Contract {
            name
            stats {
              totalSales
              average
              ceiling
              floor
              volume
            }
            symbol
          }
        }
      }
    }
  }
`;

export const searchCollectionsQuery = gql`
  query SearchCollections($query: String!) {
    contracts(filter: { name: { icontains: $query }}, orderBy: VOLUME, orderDirection: DESC) {
      edges {
        node {
          address
          ... on ERC721Contract {
            name
            stats {
              totalSales
              average
              ceiling
              floor
              volume
            }
            symbol
          }
        }
      }
    }
  }
`;
