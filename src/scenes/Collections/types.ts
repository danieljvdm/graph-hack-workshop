export interface Connection<T> {
  edges: {
    node: T;
  }[];
};

export interface Collection {
  address: string;
  name: string;
  stats: {
    totalSales: number;
    average: number;
    ceiling: number;
    floor: number;
    volume: number;
  }
  symbol: number;
}

export interface TrendingCollectionsQuery {
  contracts: Connection<Collection>;
}

export interface SearchCollectionsQuery {
  contracts: Connection<Collection>;
}