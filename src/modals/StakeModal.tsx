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
import usePosition from 'hooks/usePosition';

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
  const {
    nftManagerPositionsContract,
    stakingRewardsContract,
  } = useContracts();
  const { isWorking, approve, transfer, stake } = usePosition(
    parseInt(tokenId)
  );

  const [activeStep, setActiveStep] = useState<number>(0);

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
        return approve(() => setActiveStep(1));
      case 1:
        return transfer(() => setActiveStep(2));
      case 2:
        return stake(() => history.push('/'));
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
