import { FC, useContext, useMemo, createContext, ReactNode } from 'react';
import { ethers } from 'ethers';

import {
  TOKEN_0_ADDRESS,
  TOKEN_1_ADDRESS,
  NFT_POSITIONS_MANAGER_ADDRESS,
  STAKING_REWARDS_ADDRESS,
} from 'config';
import { useWallet } from 'contexts/wallet';
import useTokenInfo from 'hooks/useTokenInfo';
import NFT_POSITIONS_MANAGER_ABI from 'abis/nft_positions_manager.json';
import STAKING_REWARDS_ABI from 'abis/staking_rewards.json';

const ContractsContext = createContext<{
  token0Address: string | null;
  token1Address: string | null;
  token0Decimals: number | null;
  token1Decimals: number | null;
  token0Symbol: string | null;
  token1Symbol: string | null;
  stakingRewardsContract: ethers.Contract | null;
  nftManagerPositionsContract: ethers.Contract | null;
} | null>(null);

export const ContractsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { network, signer } = useWallet();

  const token0Address = !network ? null : TOKEN_0_ADDRESS[network];
  const token1Address = !network ? null : TOKEN_1_ADDRESS[network];

  const { decimals: token0Decimals, symbol: token0Symbol } = useTokenInfo(
    token0Address
  );
  const { decimals: token1Decimals, symbol: token1Symbol } = useTokenInfo(
    token1Address
  );

  const nftManagerPositionsAddress = !network
    ? null
    : NFT_POSITIONS_MANAGER_ADDRESS[network];
  const stakingRewardsAddress = !network
    ? null
    : STAKING_REWARDS_ADDRESS[network];

  const nftManagerPositionsContract = useMemo(
    () =>
      !(nftManagerPositionsAddress && signer)
        ? null
        : new ethers.Contract(
            nftManagerPositionsAddress,
            NFT_POSITIONS_MANAGER_ABI,
            signer
          ),
    [nftManagerPositionsAddress, signer]
  );

  const stakingRewardsContract = useMemo(
    () =>
      !(stakingRewardsAddress && signer)
        ? null
        : new ethers.Contract(
            stakingRewardsAddress,
            STAKING_REWARDS_ABI,
            signer
          ),
    [stakingRewardsAddress, signer]
  );

  return (
    <ContractsContext.Provider
      value={{
        token0Address,
        token1Address,
        token0Decimals,
        token1Decimals,
        token0Symbol,
        token1Symbol,
        stakingRewardsContract,
        nftManagerPositionsContract,
      }}
    >
      {children}
    </ContractsContext.Provider>
  );
};

export function useContracts() {
  const context = useContext(ContractsContext);
  if (!context) {
    throw new Error('Missing Contracts context');
  }
  const {
    token0Address,
    token1Address,
    token0Decimals,
    token1Decimals,
    token0Symbol,
    token1Symbol,
    stakingRewardsContract,
    nftManagerPositionsContract,
  } = context;

  return {
    token0Address,
    token1Address,
    token0Decimals,
    token1Decimals,
    token0Symbol,
    token1Symbol,
    stakingRewardsContract,
    nftManagerPositionsContract,
  };
}
