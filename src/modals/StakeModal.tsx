import { FC, useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import capitalize from 'lodash/capitalize';
import CloseIcon from '@material-ui/icons/Close';

import { useWallet } from 'contexts/wallet';
import { useContracts } from 'contexts/contracts';
import { useNotifications } from 'contexts/notifications';

export const useStyles = makeStyles((theme) => ({
  container: {
    width: 600,
  },
}));

const STEPS = ['approve', 'transfer', 'stake'];

const StakeStepper: FC<{
  match: { params: { tokenId: string } };
  history: any;
}> = ({
  match: {
    params: { tokenId },
  },
  history,
}) => {
  const classes = useStyles();
  const { tx } = useNotifications();
  const { address } = useWallet();
  const {
    nftManagerPositionsContract,
    stakingRewardsContract,
    currentIncentive,
    currentIncentiveId,
    incentives,
    setCurrentIncentiveId,
  } = useContracts();

  const [isWorking, setIsWorking] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  // load approval
  useEffect(() => {
    if (!(stakingRewardsContract && nftManagerPositionsContract)) return;

    const load = async () => {
      const [approvedAddress, owner] = await Promise.all([
        nftManagerPositionsContract.getApproved(tokenId),
        nftManagerPositionsContract.ownerOf(tokenId),
      ]);
      if (owner === stakingRewardsContract.address) {
        setActiveStep(2);
      } else if (approvedAddress === stakingRewardsContract.address) {
        setActiveStep(1);
      }
    };
    load();
  }, [tokenId, stakingRewardsContract, nftManagerPositionsContract]);

  const close = () => history.push('/');

  const approveOrTransferOrStake = () => {
    switch (activeStep) {
      case 0:
        return approve();
      case 1:
        return transfer();
      case 2:
        return stake();
      default:
        console.warn(`unknown step: ${activeStep}`);
    }
  };

  const approve = useCallback(async () => {
    if (
      !(
        nftManagerPositionsContract &&
        stakingRewardsContract &&
        currentIncentive
      )
    )
      return;

    try {
      setIsWorking('Approving..');
      await tx('Approving..', 'Approved!', () =>
        nftManagerPositionsContract.approve(
          stakingRewardsContract.address,
          tokenId
        )
      );
      setActiveStep(1);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsWorking(null);
    }
  }, [
    tokenId,
    currentIncentive,
    stakingRewardsContract,
    nftManagerPositionsContract,
    tx,
  ]);

  const transfer = useCallback(async () => {
    if (
      !(
        address &&
        nftManagerPositionsContract &&
        stakingRewardsContract &&
        currentIncentive
      )
    )
      return;

    try {
      setIsWorking('Transfering..');
      await tx(
        'Transfering..',
        'Transfered!',
        () =>
          nftManagerPositionsContract[
            'safeTransferFrom(address,address,uint256)'
          ](address, stakingRewardsContract.address, tokenId) // https://stackoverflow.com/questions/68289806/no-safetransferfrom-function-in-ethers-js-contract-instance
      );
      setActiveStep(2);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsWorking(null);
    }
  }, [
    tokenId,
    currentIncentive,
    stakingRewardsContract,
    nftManagerPositionsContract,
    address,
    tx,
  ]);

  const stake = useCallback(async () => {
    if (!(stakingRewardsContract && currentIncentive)) return;

    try {
      setIsWorking('Staking..');
      await tx('Staking..', 'Staked!', () =>
        stakingRewardsContract.stakeToken(currentIncentive.key, tokenId)
      );
    } catch (e) {
      console.warn(e);
    } finally {
      setIsWorking(null);
    }
  }, [tokenId, currentIncentive, stakingRewardsContract, tx]);

  return (
    <Dialog open={true} onClose={() => {}}>
      <Box className={classes.container}>
        <Box
          px={4}
          mt={2}
          className='flex flex-grow justify-space items-center'
        >
          <Typography variant='h5'>Stake #{tokenId}</Typography>

          <CloseIcon className='cursor-pointer' onClick={close} />
        </Box>

        <Stepper activeStep={activeStep}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{capitalize(label)}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box px={4} mb={2}>
          {activeStep !== 2 ? null : (
            <Box mb={2}>
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
                      {incentive.key.startTime} - {incentive.key.endTime}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <Button
            color='secondary'
            variant='contained'
            onClick={approveOrTransferOrStake}
          >
            {isWorking ? isWorking : STEPS[activeStep]}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default StakeStepper;
