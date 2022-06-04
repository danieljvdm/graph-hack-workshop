import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import "./Collections.css";
import { SearchCollectionsQuery, TrendingCollectionsQuery } from "./types";
import { searchCollectionsQuery, trendingCollectionsQuery } from "./queries";

function Collections() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: trendingCollectionsQueryData } =
    useQuery<TrendingCollectionsQuery>(trendingCollectionsQuery);
  
  const [searchCollections, { data: searchCollectionsQueryData }] = useLazyQuery<SearchCollectionsQuery>(
    searchCollectionsQuery
  );

  const collectionsToShow =
    searchCollectionsQueryData?.contracts.edges.length ?
      searchCollectionsQueryData.contracts.edges :
      (trendingCollectionsQueryData?.contracts.edges ?? []);

  return (
    <div className="App">
      <div className="search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={async () => {
            await searchCollections({ variables: { query: searchTerm } });
          }}
        >
          Search!
        </button>
      </div>
      <div>
        Stats in last hour
      </div>
      <table>
        <thead>
          <td>Collection</td>
          <td style={{ textAlign: "right" }}>Floor</td>
          <td style={{ textAlign: "right" }}>Volume</td>
          <td style={{ textAlign: "right" }}>Total Sales</td>
          <td style={{ textAlign: "right" }}>Average</td>
        </thead>
        <tbody>
          {collectionsToShow.map(
            (collection) => {
              return (
                <tr key={collection.node.address}>
                  <td>{collection.node.name}</td>
                  <td className="mono">Ξ{collection.node.stats.floor.toFixed(3)}</td>
                  <td className="mono">Ξ{collection.node.stats.volume.toFixed(3)}</td>
                  <td className="mono">{collection.node.stats.totalSales}</td>
                  <td className="mono">Ξ{collection.node.stats.average.toFixed(3)}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Collections;
