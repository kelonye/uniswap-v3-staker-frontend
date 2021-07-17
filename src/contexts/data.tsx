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
import _flatten from 'lodash/flatten';
import _orderBy from 'lodash/orderBy';

import { INCENTIVES } from 'config';
import { useWallet } from './wallet';
import { useContracts } from './contracts';

import useTokenInfo from 'hooks/useTokenInfo';

import { Incentive, LiquidityPosition } from 'utils/types';

const DataContext = createContext<{
  positions: LiquidityPosition[];
  ewitBalance: BigNumber;
  incentives: Incentive[];
  currentIncentiveId: string | null;
  currentIncentive: Incentive | null;
  setCurrentIncentiveId: (id: string) => void;
} | null>(null);

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    ewitAddress,
    stakingRewardsContract,
    nftManagerPositionsContract,
  } = useContracts();
  const { network, address } = useWallet();
  const [positions, setPositions] = useState<LiquidityPosition[]>([]);
  const [incentives, setIncentiveIds] = useState<Incentive[]>([]);
  const [currentIncentiveId, setCurrentIncentiveId] = useState<string | null>(
    null
  );

  const { balance: ewitBalance } = useTokenInfo(ewitAddress);

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

  // load owned and transfered positions
  useEffect(() => {
    if (
      !(
        nftManagerPositionsContract &&
        stakingRewardsContract &&
        address &&
        currentIncentiveId
      )
    )
      return;

    const loadPositions = async (owner: string) => {
      const noOfPositions = await nftManagerPositionsContract.balanceOf(owner);
      const positions = await Promise.all(
        new Array(noOfPositions.toNumber())
          .fill(0)
          .map((_, index) => loadPosition(owner, index))
      );
      const ownerPositions: LiquidityPosition[] = [];
      positions.forEach((position) => {
        if (position) {
          ownerPositions.push(position);
        }
      });
      return ownerPositions;
    };

    const loadPosition = async (
      owner: string,
      index: number
    ): Promise<LiquidityPosition | null> => {
      const tokenId = await nftManagerPositionsContract.tokenOfOwnerByIndex(
        owner,
        index
      );
      const { liquidity } = await nftManagerPositionsContract.positions(
        tokenId
      );
      if (liquidity.isZero()) return null;
      const position = await stakingRewardsContract.deposits(tokenId);
      if (owner !== address && position.owner !== address) return null;
      return {
        tokenId,
        owner,
      };
    };

    const load = async () => {
      const owners: string[] = [address, stakingRewardsContract.address];
      const positions = await Promise.all(owners.map(loadPositions));
      setPositions(_orderBy(_flatten(positions), 'tokenId'));
    };

    load();
  }, [
    nftManagerPositionsContract,
    stakingRewardsContract,
    address,
    currentIncentiveId,
  ]);

  return (
    <DataContext.Provider
      value={{
        positions,
        ewitBalance,
        incentives,
        currentIncentiveId,
        currentIncentive,
        setCurrentIncentiveId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('Missing Data context');
  }
  const {
    positions,
    ewitBalance,
    incentives,
    currentIncentiveId,
    currentIncentive,
    setCurrentIncentiveId,
  } = context;

  return {
    positions,
    ewitBalance,
    incentives,
    currentIncentiveId,
    currentIncentive,
    setCurrentIncentiveId,
  };
}
