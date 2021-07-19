import { FC, useState } from 'react';
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

import usePosition from 'hooks/usePosition';

export const useStyles = makeStyles((theme) => ({
  container: {
    width: 600,
  },
}));

const STEPS = ['unstake'];

const UnstakeStepper: FC<{
  match: { params: { tokenId: string } };
  history: any;
}> = ({
  match: {
    params: { tokenId },
  },
  history,
}) => {
  const classes = useStyles();

  const { isWorking, unstake } = usePosition(parseInt(tokenId));
  const [activeStep] = useState<number>(0);

  const close = () => history.push('/');

  return (
    <Dialog open={true} onClose={() => {}}>
      <Box className={classes.container}>
        <Box
          px={4}
          mt={2}
          className='flex flex-grow justify-space items-center'
        >
          <Typography variant='h5'>Unstake #{tokenId}</Typography>

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
            onClick={() => unstake(() => history.push('/'))}
          >
            {isWorking ? isWorking : STEPS[activeStep]}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UnstakeStepper;
