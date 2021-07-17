export type Incentive = {
  id: string;
  key: {
    rewardToken: string;
    pool: string;
    startTime: number;
    endTime: number;
    refundee: string;
  };
};

export type LiquidityPosition = {
  tokenId: number;
  owner: string;
};
