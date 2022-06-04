import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import "./Collections.css";
import { SearchCollectionsQuery, TrendingCollectionsQuery } from "./types";
import { searchCollectionsQuery, trendingCollectionsQuery } from "./queries";

function Collections() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: trendingCollectionQueryData } =
    useQuery<TrendingCollectionsQuery>(trendingCollectionsQuery);
  const [getCollections, { data }] = useLazyQuery<SearchCollectionsQuery>(
    searchCollectionsQuery
  );

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
            await getCollections({ variables: { query: searchTerm } });
          }}
        >
          Search!
        </button>
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
          {(trendingCollectionQueryData?.contracts.edges ?? []).map(
            (collection) => {
              return (
                <tr>
                  <td>{collection.node.name}</td>
                  <td className="mono">{collection.node.stats.floor}</td>
                  <td className="mono">{collection.node.stats.volume}</td>
                  <td className="mono">{collection.node.stats.totalSales}</td>
                  <td className="mono">{collection.node.stats.average}</td>
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
