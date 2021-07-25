export const BORDER_RADIUS = 4;
export const APP_NAME = 'Witswap | Staking';

export const LG_BREAKPOINT = 'md';
export const SM_BREAKPOINT = 'sm';

export const IS_DEV = process.env.NODE_ENV === 'development';

export const CACHE_WALLET_KEY = 'wallet';

export const NETWORK_MAINNET = 'mainnet';
export const NETWORK_RINKEBY = 'rinkeby';
export const AVAILABLE_NETWORKS = [NETWORK_MAINNET, NETWORK_RINKEBY];

export const TOKEN_0_ADDRESS: Record<string, string> = {
  [NETWORK_RINKEBY]: '0x2ef5B89bFD5BA8C3b15879106C57010aA7A32D06',
  [NETWORK_MAINNET]: '0x56ee175fe37cd461486ce3c3166e0cafccd9843f',
};

export const TOKEN_1_ADDRESS: Record<string, string> = {
  [NETWORK_RINKEBY]: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
  [NETWORK_MAINNET]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
};

export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
  [NETWORK_RINKEBY]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  [NETWORK_MAINNET]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
};

export const STAKING_REWARDS_ADDRESS: Record<string, string> = {
  [NETWORK_RINKEBY]: '0xc462aB5e66067153Bf1B368493E4744C1cA4BeC9',
  [NETWORK_MAINNET]: '0x9213d5c6d737Fc2744db9d67037fE90D76Cb0F77',
};

export const SUBGRAPHS: Record<string, string> = {
  [NETWORK_RINKEBY]:
    'https://api.thegraph.com/subgraphs/name/vbstreetz/witswap-staking-rinkeby',
  [NETWORK_MAINNET]:
    'https://api.thegraph.com/subgraphs/name/vbstreetz/witswap-staking',
};
