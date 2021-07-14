import {
  FC,
  useState,
  useContext,
  useMemo,
  useEffect,
  createContext,
  ReactNode,
} from 'react';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import {
  USDC_ADDRESS,
  EWIT_ADDRESS,
  NFT_POSITIONS_MANAGER_ADDRESS,
  STAKING_REWARDS_ADDRESS,
  INCENTIVES,
} from 'config';
import { useWallet } from './wallet';

import NFT_POSITIONS_MANAGER_ABI from 'abis/nft_positions_manager.json';
import STAKING_REWARDS_ABI from 'abis/staking_rewards.json';
import useTokenInfo from 'hooks/useTokenInfo';

import { Incentive, LiquidityPosition } from 'utils/types';

const ContractsContext = createContext<{
  usdcAddress: string | null;
  ewitAddress: string | null;
  usdcDecimals: number;
  ewitDecimals: number;
  unstakedPositions: LiquidityPosition[];
  stakedPositions: LiquidityPosition[];
  ewitBalance: BigNumber;
  incentives: Incentive[];
  currentIncentiveId: string | null;
  currentIncentive: Incentive | null;
  setCurrentIncentiveId: (id: string) => void;
  stakingRewardsContract: ethers.Contract | null;
  nftManagerPositionsContract: ethers.Contract | null;
} | null>(null);

export const ContractsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { network, signer, address } = useWallet();
  const [unstakedPositions, setUnstakedPositions] = useState<
    LiquidityPosition[]
  >([]);
  const [stakedPositions, setStakedPositions] = useState<LiquidityPosition[]>(
    []
  );
  const [incentives, setIncentiveIds] = useState<Incentive[]>([]);
  const [currentIncentiveId, setCurrentIncentiveId] = useState<string | null>(
    null
  );

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

  const { balance: ewitBalance } = useTokenInfo(ewitAddress);

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

  const currentIncentive = useMemo(
    () =>
      !currentIncentiveId
        ? null
        : incentives.find((incentive) => incentive.id === currentIncentiveId) ??
          null,
    [currentIncentiveId, incentives]
  );

  // load incentives
  useEffect(() => {
    if (!network) return;
    const incentives = INCENTIVES[network];
    setIncentiveIds(incentives);
    setCurrentIncentiveId(incentives[0].id);
  }, [network]);

  // load unstaked positions
  useEffect(() => {
    if (!(nftManagerPositionsContract && address && currentIncentiveId)) return;

    const loadPositions = async () => {
      const noOfPositions = await nftManagerPositionsContract.balanceOf(
        address
      );
      const positions = await Promise.all(
        new Array(noOfPositions.toNumber()).fill(0).map(loadPosition)
      );
      setUnstakedPositions(positions);
    };

    const loadPosition = async (
      o: any,
      index: number
    ): Promise<LiquidityPosition> => {
      const tokenId = await nftManagerPositionsContract.tokenOfOwnerByIndex(
        address,
        index
      );
      return {
        tokenId,
      };
    };

    loadPositions();
  }, [nftManagerPositionsContract, address, currentIncentiveId]);

  // load staked positions
  useEffect(() => {
    if (
      !(
        nftManagerPositionsContract &&
        stakingRewardsContract &&
        address &&
        stakingRewardsAddress &&
        currentIncentiveId
      )
    )
      return;

    const loadPositions = async () => {
      const noOfPositions = await nftManagerPositionsContract.balanceOf(
        stakingRewardsAddress
      );
      const positions = await Promise.all(
        new Array(noOfPositions.toNumber()).fill(0).map(loadPosition)
      );
      const ownerPositions: LiquidityPosition[] = [];
      positions.forEach((position) => {
        if (position) {
          ownerPositions.push(position);
        }
      });
      setStakedPositions(ownerPositions);
    };

    const loadPosition = async (
      o: any,
      index: number
    ): Promise<LiquidityPosition | null> => {
      const tokenId = await nftManagerPositionsContract.tokenOfOwnerByIndex(
        stakingRewardsAddress,
        index
      );
      const { owner } = await stakingRewardsContract.deposits(tokenId);
      if (owner !== address) return null;
      return {
        tokenId,
      };
    };

    loadPositions();
  }, [
    nftManagerPositionsContract,
    stakingRewardsContract,
    address,
    stakingRewardsAddress,
    currentIncentiveId,
  ]);

  return (
    <ContractsContext.Provider
      value={{
        usdcAddress,
        ewitAddress,
        ewitDecimals,
        usdcDecimals,
        unstakedPositions,
        stakedPositions,
        ewitBalance,
        incentives,
        currentIncentiveId,
        currentIncentive,
        setCurrentIncentiveId,
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
    unstakedPositions,
    stakedPositions,
    ewitBalance,
    incentives,
    currentIncentiveId,
    currentIncentive,
    setCurrentIncentiveId,
    stakingRewardsContract,
    nftManagerPositionsContract,
  } = context;

  return {
    usdcAddress,
    ewitAddress,
    ewitDecimals,
    usdcDecimals,
    unstakedPositions,
    stakedPositions,
    ewitBalance,
    incentives,
    currentIncentiveId,
    currentIncentive,
    setCurrentIncentiveId,
    stakingRewardsContract,
    nftManagerPositionsContract,
  };
}
