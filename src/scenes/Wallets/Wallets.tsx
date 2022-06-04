import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import './Wallets.css';
import { CollectionStatsQuery, CollectionWithStats, WalletTokensQuery } from './types';
import { tokensQuery, collectionStatsQuery } from './queries';

function Wallets() {
  const [ensName, setEnsName] = useState('');
  const [collectionsWithStats, setCollectionsWithStats] = useState<CollectionWithStats[]>([]);

  const [getWalletTokens, { data, client }] = useLazyQuery<WalletTokensQuery>(tokensQuery);

  useEffect(() => {
    fetchCollectionStats();
  }, [data?.wallet?.tokens])

  const fetchCollectionStats = async () => {
    const oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1));
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
  
    const collectionStats = collectionStatsData.map(data => data.data?.contract).filter(v => v !== undefined) as CollectionWithStats[];
    setCollectionsWithStats(collectionStats);
  }

  return (
    <div className="Wallets">
      <input type="text" value={ensName} onChange={e => setEnsName(e.target.value)} />
      <button onClick={async () => {
        await getWalletTokens({ variables: { ensName }})
      }}>
        Search!
      </button> 
      <p>{data?.wallet?.address ?? "not found"}</p>
      {data?.wallet?.tokens.edges.map(e => {
        const token = e.node;
        const contract = token.contract;
        const stats = collectionsWithStats.find((collection) => collection.address === token.contract.address)?.stats;
        const imageUrl = token.images.find(i => !!i.url)?.url;

        return (
          <p>
            <h1>{contract.name}</h1>
            <h2>{contract.symbol}#{token.tokenId}</h2>
            {imageUrl && <img src={imageUrl} alt="lol" />}
            <p>Floor: {stats?.floor ?? 'Not enough data'}Ξ</p>
            <p>Volume: {stats?.volume}Ξ</p>
          </p>
        )
      })}
    </div>
  );
}

export default Wallets;
