import {
  useLazyQuery,
  gql
} from '@apollo/client';
import { useEffect, useState } from 'react';
import './App.css';
import { Connection } from './types';

interface CollectionWithStats {
  address: string;
  stats: CollectionStats;
}
interface CollectionStats {
  floor: number;
  volume: number;
}
interface WalletTokensQuery {
  wallet: {
    ensName: string;
    address: string;
    tokens: Connection<{ tokenId: string, contract: { address: string, symbol: string, name: string }}>
  } | null;
}

const tokensQuery = gql`
  query WalletTokens($ensName: String!) {
    wallet(ensName: $ensName) {
      ensName
      address
      tokens {
        edges {
          node {
            tokenId
            contract {
              address
              ... on ERC721Contract {
                symbol
                name
              }
            }
          }
        }
      }
    }
  }
`;

const collectionStatsQuery = gql`
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

interface CollectionStatsQuery {
  contract: CollectionWithStats;
}

function App() {
  const [ensName, setEnsName] = useState('');
  const [collectionsWithStats, setCollectionsWithStats] = useState<CollectionWithStats[]>([]);

  const [getWalletTokens, { data, client }] = useLazyQuery<WalletTokensQuery>(tokensQuery);

  useEffect(() => {
    fetchCollectionStats();
  }, [data?.wallet?.tokens])

  const fetchCollectionStats = async () => {
    const oneDayAgo = new Date(new Date().setDate(new Date().getDate()-1));
    const now = new Date();

    console.log(data);
    const collectionAddresses = (data?.wallet?.tokens.edges ?? []).map(e => e.node.contract.address);
    console.log(collectionAddresses);
    if (collectionAddresses.length === 0) return;

    const collectionStatsData = await Promise.all(collectionAddresses.map(address => {
      console.log('ADDRESS: ', address);
      return client.query<CollectionStatsQuery>({
        query: collectionStatsQuery,
        fetchPolicy: 'network-only',
        variables: {
          address,
          timeRange: {
            gte: oneDayAgo,
            lte: now,
          }
        }
      });
    }));
  
    console.log('collectionStatsData: ', collectionStatsData);
    const collectionStats = collectionStatsData.map(data => data.data?.contract).filter(v => v !== undefined) as CollectionWithStats[];

    console.log(collectionStats);
    setCollectionsWithStats(collectionStats);
  }

  return (
    <div className="App">
      <input type="text" value={ensName} onChange={e => setEnsName(e.target.value)} />
      <button onClick={async () => {
        await getWalletTokens({ variables: { ensName }})
      }}>
        Search!
      </button> 
      <p>{data?.wallet?.address ?? "not found"}</p>
      {data?.wallet?.tokens.edges.map(token => {
        const contract = token.node.contract;
        const stats = collectionsWithStats.find((collection) => collection.address === token.node.contract.address)?.stats;

        return (
          <p>
            <h1>{contract.name}</h1>
            <p>Floor: {stats?.floor}</p>
            <p>Volume: {stats?.volume}</p>
          </p>
        )

      })}
    </div>
  );
}

export default App;
