import { FC } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useUI } from 'contexts/ui';

const Notifications: FC = () => {
  const { notification, notify } = useUI();

  // const handleClose = (event: any, reason: any) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpen(false);
  // };

  const handleClose = () => {
    notify(null);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={!!notification}
      autoHideDuration={6000}
      onClose={handleClose}
      message={notification}
      action={
        <>
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={handleClose}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </>
      }
    />
  );
};

export default Notifications;
