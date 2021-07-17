import { FC, useContext, useMemo, createContext, ReactNode } from 'react';
import { ethers } from 'ethers';

import {
  USDC_ADDRESS,
  EWIT_ADDRESS,
  NFT_POSITIONS_MANAGER_ADDRESS,
  STAKING_REWARDS_ADDRESS,
} from 'config';
import { useWallet } from './wallet';

import NFT_POSITIONS_MANAGER_ABI from 'abis/nft_positions_manager.json';
import STAKING_REWARDS_ABI from 'abis/staking_rewards.json';

const ContractsContext = createContext<{
  usdcAddress: string | null;
  ewitAddress: string | null;
  usdcDecimals: number;
  ewitDecimals: number;
  stakingRewardsContract: ethers.Contract | null;
  nftManagerPositionsContract: ethers.Contract | null;
} | null>(null);

export const ContractsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { network, signer } = useWallet();

  const usdcAddress = !network ? null : USDC_ADDRESS[network];
  const ewitAddress = !network ? null : EWIT_ADDRESS[network];
  const nftManagerPositionsAddress = !network
    ? null
    : NFT_POSITIONS_MANAGER_ADDRESS[network];
  const stakingRewardsAddress = !network
    ? null
    : STAKING_REWARDS_ADDRESS[network];

  const ewitDecimals = 9;
  const usdcDecimals = 9;

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
        usdcAddress,
        ewitAddress,
        ewitDecimals,
        usdcDecimals,
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
    usdcAddress,
    ewitAddress,
    ewitDecimals,
    usdcDecimals,
    stakingRewardsContract,
    nftManagerPositionsContract,
  } = context;

  return {
    usdcAddress,
    ewitAddress,
    ewitDecimals,
    usdcDecimals,
    stakingRewardsContract,
    nftManagerPositionsContract,
  };
}
