import BigNumber from 'bignumber.js';

export type Incentive = {
  id: string;
  reward: BigNumber;
  ended: boolean;
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
  staked: boolean;
  reward: BigNumber;
};
