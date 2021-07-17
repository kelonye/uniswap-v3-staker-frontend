import { FC } from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

import { UIProvider } from 'contexts/ui';
import { WalletProvider } from 'contexts/wallet';
import { NotificationsProvider } from 'contexts/notifications';
import { ContractsProvider } from 'contexts/contracts';
import { DataProvider } from 'contexts/data';

import Layout from 'components/global/Layout';
import Notification from 'components/shared/Notification';

import theme from 'utils/theme';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    top: 70,
  },
}));

const App: FC = () => {
  const classes = useStyles();

  return (
    <ThemeProvider {...{ theme }}>
      <CssBaseline />
      <UIProvider>
        <WalletProvider>
          <ContractsProvider>
            <DataProvider>
              <SnackbarProvider
                classes={{ root: classes.snackbar }}
                maxSnack={4}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                content={(key, data) => (
                  <div>
                    <Notification id={key} notification={data} />
                  </div>
                )}
              >
                <NotificationsProvider>
                  <Layout />
                </NotificationsProvider>
              </SnackbarProvider>
            </DataProvider>
          </ContractsProvider>
        </WalletProvider>
      </UIProvider>
    </ThemeProvider>
  );
};

export default App;
