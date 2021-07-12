import { FC, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
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

const Stake: FC<{ history: any }> = ({ history }) => {
  const classes = useStyles();
  const { startConnecting: startConnectingWallet, address } = useWallet();
  const { usdcAddress, ewitAddress, unstakedPositions } = useContracts();

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
                You have {unstakedPositions.length} EWIT-USDC liquidity
                positions.
              </Typography>
            </Box>

            <Box mt={2}>
              Get {!unstakedPositions.length ? 'some' : 'more'} by providing
              liquidity to the EWIT-USDC Pool over{' '}
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
            </Box>

            {!unstakedPositions.length ? null : (
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
                    {unstakedPositions.map((position) => (
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

  const stake = useCallback(async () => {
    history.push(`/stake/${position.tokenId}`);
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
          onClick={stake}
          className={classes.depositButton}
        >
          Stake
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default withRouter(Stake);
