import { FC, useState, useEffect, ReactNode } from 'react';
import * as ethers from 'ethers';
import { makeStyles } from '@material-ui/core/styles';
import { formatUnits } from 'utils/big-number';
import { useWallet } from 'contexts/wallet';
import useTokenInfo from 'hooks/useTokenInfo';

const useStyles = makeStyles((theme) => ({
  container: {},
}));

const Balance: FC<{
  header?: ReactNode;
  isETH?: boolean;
  tokenAddress?: string;
}> = ({ header, isETH, tokenAddress }) => {
  const { signer } = useWallet();
  return !signer ? null : isETH ? (
    <ETH {...{ header }} />
  ) : !tokenAddress ? null : (
    <ERC20 {...{ header, tokenAddress }} />
  );
};

export default Balance;

const ETH: FC<{ header: ReactNode }> = ({ header }) => {
  const classes = useStyles();
  const { signer } = useWallet();
  const [balance, setBalance] = useState(ethers.BigNumber.from('0'));

  useEffect(() => {
    if (!signer) return;

    const provider = signer.provider!;
    if (!provider) return;

    const load = async () => {
      setBalance(await signer.getBalance());
    };

    const subscribe = () => {
      const eventName = 'block';
      provider.on(eventName, load);
      return () => {
        provider.off(eventName, load);
      };
    };

    load();
    return subscribe();
  }, [signer]);

  return (
    balance && (
      <div className={classes.container}>
        {header}: {formatUnits(balance, 18)} ETH
      </div>
    )
  );
};

const ERC20: FC<{ header: ReactNode; tokenAddress: string }> = ({
  header,
  tokenAddress,
}) => {
  const classes = useStyles();
  const { symbol, decimals, balance } = useTokenInfo(tokenAddress);

  return !(symbol && decimals && balance) ? null : (
    <div className={classes.container}>
      {header}: {formatUnits(balance, decimals)} {symbol.toUpperCase()}
    </div>
  );
};
