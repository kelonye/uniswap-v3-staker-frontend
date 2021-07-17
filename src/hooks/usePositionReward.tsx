import { useEffect, useState } from 'react';
import { useContracts } from 'contexts/contracts';
import { toBigNumber } from 'utils/big-number';
import { useData } from 'contexts/data';

const usePositionReward = (tokenId: number) => {
  const { stakingRewardsContract } = useContracts();
  const { currentIncentive } = useData();
  const [reward, setReward] = useState(toBigNumber(0));
  const [staked, setStaked] = useState(false);

  useEffect(() => {
    if (!(stakingRewardsContract && currentIncentive)) return;
    const load = async () => {
      try {
        const [reward] = await stakingRewardsContract.getRewardInfo(
          currentIncentive.key,
          tokenId
        );
        setReward(toBigNumber(reward.toString()));
        setStaked(true);
      } catch {}
    };
    load();
  }, [stakingRewardsContract, currentIncentive, tokenId]);

  return { reward, staked };
};

export default usePositionReward;
