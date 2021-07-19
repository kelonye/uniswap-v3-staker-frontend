import { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import capitalize from 'lodash/capitalize';
import CloseIcon from '@material-ui/icons/Close';

import { useContracts } from 'contexts/contracts';
import { useData } from 'contexts/data';
import usePosition from 'hooks/usePosition';

export const useStyles = makeStyles((theme) => ({
  container: {
    width: 600,
  },
}));

const STEPS = ['unstake', 'withdraw'];

const WithdrawStepper: FC<{
  match: { params: { tokenId: string } };
  history: any;
}> = ({
  match: {
    params: { tokenId },
  },
  history,
}) => {
  const classes = useStyles();
  const { stakingRewardsContract } = useContracts();
  const { currentIncentiveId } = useData();
  const { isWorking, unstake, withdraw } = usePosition(parseInt(tokenId));
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (!(stakingRewardsContract && currentIncentiveId)) return;

    const load = async () => {
      const deposit = await stakingRewardsContract.deposits(tokenId);
      const isStaked = deposit?.numberOfStakes !== 0;
      if (!isStaked) {
        setActiveStep(1);
      }
    };
    load();
  }, [tokenId, currentIncentiveId, stakingRewardsContract]);

  const close = () => history.push('/');

  const unstakeOrWithdraw = () => {
    switch (activeStep) {
      case 0:
        return unstake(() => setActiveStep(1));
      case 1:
        return withdraw(() => history.push('/'));
      default:
        console.warn(`unknown step: ${activeStep}`);
    }
  };

  return (
    <Dialog open={true} onClose={() => {}}>
      <Box className={classes.container}>
        <Box
          px={4}
          mt={2}
          className='flex flex-grow justify-space items-center'
        >
          <Typography variant='h5'>Withdraw #{tokenId}</Typography>

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
          <Button
            color='secondary'
            variant='contained'
            onClick={unstakeOrWithdraw}
          >
            {isWorking ? isWorking : STEPS[activeStep]}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default WithdrawStepper;
