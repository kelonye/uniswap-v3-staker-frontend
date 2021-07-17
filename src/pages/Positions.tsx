import { FC, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import * as ethers from 'ethers';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import moment from 'moment';

import { useWallet } from 'contexts/wallet';
import { useContracts } from 'contexts/contracts';
import { useNotifications } from 'contexts/notifications';
import { useData } from 'contexts/data';
import usePositionReward from 'hooks/usePositionReward';
import { LiquidityPosition } from 'utils/types';
import { formatUnits } from 'utils/big-number';

export const useStyles = makeStyles((theme) => ({
  maxButton: {
    height: 35,
  },
  depositButtonCell: {
    width: 110,
    padding: 5,
  },
  depositButton: {
    width: 100,
  },
}));

const Stake: FC<{ history: any }> = ({ history }) => {
  const classes = useStyles();
  const { startConnecting: startConnectingWallet, address } = useWallet();
  const { usdcAddress, ewitAddress } = useContracts();
  const {
    positions,
    currentIncentiveId,
    incentives,
    setCurrentIncentiveId,
  } = useData();

  return (
    <>
      <Box p={5}>
        {!address ? (
          <>
            <Box>
              <Typography variant='h5'>
                You are about to earn rewards by staking Witnet tokens on
                Ethereum!
              </Typography>
            </Box>

            <Box mt={2}>
              <Button
                color='secondary'
                variant='contained'
                onClick={startConnectingWallet}
                className={classes.depositButton}
              >
                Connect Wallet
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Typography>
                You have {positions.length} EWIT-USDC liquidity positions.
              </Typography>
            </Box>

            <Box>
              <Typography variant='caption'>
                Get {!positions.length ? 'some' : 'more'} by providing liquidity
                to the EWIT-USDC Pool over{' '}
                <a
                  href={`https://app.uniswap.org/#/add/${[
                    usdcAddress,
                    ewitAddress,
                  ].join('/')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  here
                </a>
                .
              </Typography>
            </Box>

            <Box m={2} mt={3} className='flex flex-grow justify-space'>
              <FormControl>
                <InputLabel id='incentive-label'>Incentive</InputLabel>
                <Select
                  labelId='incentive-label'
                  id='incentive'
                  value={currentIncentiveId}
                  onChange={(e) => {
                    setCurrentIncentiveId(e.target.value as string);
                  }}
                >
                  {incentives.map((incentive) => (
                    <MenuItem value={incentive.id} key={incentive.id}>
                      {formatTimestamp(incentive.key.startTime)} -{' '}
                      {formatTimestamp(incentive.key.endTime)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ClaimAvailableReward />
            </Box>

            {!positions.length ? null : (
              <Box mt={2}>
                <Table aria-label='Loans' size={'small'}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Rewards</TableCell>
                      <TableCell
                        align='right'
                        className={classes.depositButtonCell}
                      ></TableCell>
                      <TableCell
                        align='right'
                        className={classes.depositButtonCell}
                      ></TableCell>
                      <TableCell
                        align='right'
                        className={classes.depositButtonCell}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {positions.map((position) => (
                      <LiquidityPositionTableRow
                        key={position.tokenId}
                        {...{ position, history }}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

const LiquidityPositionTableRow: FC<{
  position: LiquidityPosition;
  history: any;
}> = ({ position, history }) => {
  const classes = useStyles();
  const { address } = useWallet();
  const { ewitDecimals } = useContracts();
  const { staked, reward } = usePositionReward(position.tokenId);

  const stake = useCallback(async () => {
    history.push(`/stake/${position.tokenId}`);
  }, [position.tokenId, history]);

  const unstake = useCallback(async () => {
    history.push(`/unstake/${position.tokenId}`);
  }, [position.tokenId, history]);

  const claim = useCallback(async () => {
    history.push(`/claim/${position.tokenId}`);
  }, [position.tokenId, history]);

  const withdraw = useCallback(async () => {
    history.push(`/withdraw/${position.tokenId}`);
  }, [position.tokenId, history]);

  return (
    <TableRow>
      <TableCell component='th' scope='row'>
        {position.tokenId.toString()}
      </TableCell>
      <TableCell>{staked ? formatUnits(reward, ewitDecimals) : '-'}</TableCell>
      <TableCell align='right' className={classes.depositButtonCell}>
        <Button
          color='secondary'
          variant='contained'
          onClick={staked ? unstake : stake}
          className={classes.depositButton}
        >
          {staked ? 'Unstake' : 'Stake'}
        </Button>
      </TableCell>
      <TableCell align='right' className={classes.depositButtonCell}>
        <Button
          color='secondary'
          variant='contained'
          onClick={claim}
          className={classes.depositButton}
          disabled={reward.isZero()}
        >
          Claim
        </Button>
      </TableCell>
      <TableCell align='right' className={classes.depositButtonCell}>
        <Button
          color='secondary'
          variant='contained'
          onClick={withdraw}
          className={classes.depositButton}
          disabled={position.owner === address}
        >
          Withdraw
        </Button>
      </TableCell>
    </TableRow>
  );
};

const ClaimAvailableReward: FC = () => {
  const classes = useStyles();
  const { ewitDecimals, stakingRewardsContract } = useContracts();
  const { currentIncentive } = useData();
  const { address } = useWallet();
  const { tx } = useNotifications();

  const [reward, setReward] = useState(ethers.BigNumber.from(0));
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!(stakingRewardsContract && currentIncentive && address)) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const load = async () => {
      const reward = await stakingRewardsContract.rewards(
        currentIncentive.key.rewardToken,
        address
      );
      if (isMounted) setReward(reward);
    };

    const subscribe = () => {
      const tokenUnstakedEvent = stakingRewardsContract.filters.TokenUnstaked();
      stakingRewardsContract.on(tokenUnstakedEvent, load);
      unsubs.push(() => {
        stakingRewardsContract.off(tokenUnstakedEvent, load);
      });

      const rewardClaimedEvent = stakingRewardsContract.filters.RewardClaimed();
      stakingRewardsContract.on(rewardClaimedEvent, load);
      unsubs.push(() => {
        stakingRewardsContract.off(rewardClaimedEvent, load);
      });
    };

    load();
    subscribe();

    return () => {
      unsubs.map((u) => u());
    };
  }, [stakingRewardsContract, currentIncentive, address]);

  const claim = async () => {
    if (!(stakingRewardsContract && currentIncentive)) return;

    try {
      setIsClaiming(true);
      const reward = await stakingRewardsContract.rewards(
        currentIncentive.key.rewardToken,
        address
      );
      await tx('Claiming..', 'Claimed!', () =>
        stakingRewardsContract.claimReward(
          currentIncentive.key.rewardToken,
          address,
          reward
        )
      );
    } catch (e) {
      console.warn(e);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Box className='flex items-center'>
      <Box mr={1}>REWARDS:</Box>{' '}
      <Box mr={2}>{formatUnits(reward, ewitDecimals)} EWIT</Box>
      <Button
        color='secondary'
        variant='contained'
        onClick={claim}
        className={classes.depositButton}
        disabled={isClaiming || reward.isZero()}
      >
        {isClaiming ? 'Claiming...' : 'Claim'}
      </Button>
    </Box>
  );
};

function formatTimestamp(unix: number) {
  return moment.unix(unix).local().format('YYYY-MM-DD hhmm[h]');
}

export default withRouter(Stake);