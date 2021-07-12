import { FC, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { useWallet } from 'contexts/wallet';
import { useContracts } from 'contexts/contracts';
import { LiquidityPosition } from 'utils/types';

export const useStyles = makeStyles((theme) => ({
  maxButton: {
    height: 35,
  },
  depositButton: {
    width: 200,
  },
}));

const Unstake: FC<{ history: any }> = ({ history }) => {
  const classes = useStyles();
  const { startConnecting: startConnectingWallet, address } = useWallet();
  const { stakedPositions } = useContracts();

  return (
    <>
      <Box p={5}>
        {!address ? (
          <>
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
            {!stakedPositions.length ? null : (
              <Box mt={2}>
                <Table aria-label='Loans' size={'small'}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>USDC</TableCell>
                      <TableCell>EWIT</TableCell>
                      <TableCell>Rewards</TableCell>
                      <TableCell align='right'></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stakedPositions.map((position) => (
                      <PositionTableRow
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

const PositionTableRow: FC<{
  position: LiquidityPosition;
  history: any;
}> = ({ position, history }) => {
  const classes = useStyles();

  const stakeOrUnstake = useCallback(async () => {
    history.push(`/unstake/${position.tokenId}`);
  }, [position.tokenId, history]);

  return (
    <TableRow>
      <TableCell component='th' scope='row'>
        {position.tokenId.toString()}
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell align='right'>
        <Button
          color='secondary'
          variant='contained'
          onClick={stakeOrUnstake}
          className={classes.depositButton}
        >
          Unstake
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default withRouter(Unstake);
