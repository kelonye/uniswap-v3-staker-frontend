import { useEffect, useState } from 'react';
import { useContracts } from 'contexts/contracts';
import { toBigNumber } from 'utils/big-number';

const usePositionReward = (tokenId: number) => {
  const { stakingRewardsContract, currentIncentive } = useContracts();
  const [reward, setReward] = useState(toBigNumber(0));

  useEffect(() => {
    if (!(stakingRewardsContract && currentIncentive)) return;
    const load = async () => {
      try {
        const [reward] = await stakingRewardsContract.getRewardInfo(
          currentIncentive.key,
          tokenId
        );
        setReward(toBigNumber(reward.toString()));
      } catch {}
    };
    load();
  }, [stakingRewardsContract, currentIncentive, tokenId]);

  return reward;
};

export default usePositionReward;
