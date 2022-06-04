import { useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import './Collections.css';
import { SearchCollectionsQuery, TrendingCollectionsQuery} from './types';
import { searchCollectionsQuery, trendingCollectionsQuery } from './queries';

function Collections() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: trendingCollectionQueryData } = useQuery<TrendingCollectionsQuery>(trendingCollectionsQuery);
  const [getCollections, { data }] = useLazyQuery<SearchCollectionsQuery>(searchCollectionsQuery);

  return (
    <div className="App">
      <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      <button onClick={async () => {
        await getCollections({ variables: { query: searchTerm }})
      }}>
        Search!
      </button> 
      <table>
        <thead>
          <td>Collection</td>
          <td>Floor</td>
          <td>Volume</td>
          <td>Total Sales</td>
          <td>Average</td>
        </thead>
        <tbody>
          {(trendingCollectionQueryData?.contracts.edges ?? []).map((collection) => {
              return (
                <tr>
                  <td>{collection.node.name}</td>
                  <td>{collection.node.stats.floor}</td>
                  <td>{collection.node.stats.volume}</td>
                  <td>{collection.node.stats.totalSales}</td>
                  <td>{collection.node.stats.average}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default Collections;
