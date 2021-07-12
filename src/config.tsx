import { Incentive } from 'utils/types';

export const BORDER_RADIUS = 4;
export const APP_NAME = 'Witswap | Stake';

export const LG_BREAKPOINT = 'md';
export const SM_BREAKPOINT = 'sm';

export const IS_DEV = process.env.NODE_ENV === 'development';
// export const IS_DEV = false;

export const CACHE_WALLET_KEY = 'wallet';

export const NETWORK_MAINNET = 'mainnet';
export const NETWORK_RINKEBY = 'rinkeby';
export const AVAILABLE_NETWORKS = [NETWORK_MAINNET, NETWORK_RINKEBY];

export const EWIT_ADDRESS: Record<string, string> = {
  [NETWORK_RINKEBY]: '0x2ef5B89bFD5BA8C3b15879106C57010aA7A32D06',
};

export const USDC_ADDRESS: Record<string, string> = {
  [NETWORK_RINKEBY]: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
};

export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
  [NETWORK_RINKEBY]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
};

export const STAKING_REWARDS_ADDRESS: Record<string, string> = {
  [NETWORK_RINKEBY]: '0xc462aB5e66067153Bf1B368493E4744C1cA4BeC9',
};

export const INCENTIVES: Record<string, Incentive[]> = {
  [NETWORK_RINKEBY]: [
    {
      id: '0x2692397fe272eb250af25322b876e1704b036563bfb48392cd45862ff41076bb',
      key: {
        rewardToken: '0x2ef5b89bfd5ba8c3b15879106c57010aa7a32d06',
        pool: '0x34293f9D63d11ea594973C045dEFFDdE29618984',
        startTime: 1625777028,
        endTime: 1626381828,
        refundee: '0xD1F5f0753E3b31AEc955208440A32B597A38b319',
      },
    },
  ],
};
