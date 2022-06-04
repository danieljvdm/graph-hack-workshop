export interface Connection<T> {
  edges: {
    node: T;
  }[];
};

export interface CollectionWithStats {
  address: string;
  stats: CollectionStats;
}

export interface CollectionStats {
  floor: number;
  volume: number;
}

export interface Token {
  tokenId: string;
  contract: {
    address: string;
    symbol: string;
    name: string;
  };
  images: {
    url: string;
  }[];
}

export interface WalletTokensQuery {
  wallet: {
    ensName: string;
    address: string;
    tokens: Connection<Token>;
  } | null;
}

export interface CollectionStatsQuery {
  contract: CollectionWithStats;
}