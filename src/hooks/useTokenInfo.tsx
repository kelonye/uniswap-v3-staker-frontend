import { useState, useMemo, useEffect } from 'react';
import * as ethers from 'ethers';
import ERC20_CONTRACT_ABI from 'abis/erc20.json';
import { useWallet } from 'contexts/wallet';
import { sleep } from 'utils/promise';
import { toBigNumber } from 'utils/big-number';

const useTokenInfo = (tokenAddress: string | null) => {
  const [balance, setBalance] = useState(toBigNumber('0'));
  const [decimals, setDecimals] = useState<number | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const { address, signer } = useWallet();

  const contract = useMemo(
    () =>
      signer &&
      tokenAddress &&
      new ethers.Contract(tokenAddress, ERC20_CONTRACT_ABI, signer),
    [tokenAddress, signer]
  );

  useEffect(() => {
    if (!(contract && address)) return;

    const onBalanceChange = async (from: string, to: string) => {
      if (from === address || to === address) {
        await sleep(500);
        setBalance(toBigNumber(await contract.balanceOf(address)));
      }
    };

    const load = async () => {
      if (!(contract && address)) return;
      const [decimals, symbol, balance] = await Promise.all([
        contract.decimals(),
        contract.symbol(),
        contract.balanceOf(address),
      ]);
      setDecimals(decimals);
      setSymbol(symbol);
      setBalance(toBigNumber(balance));
    };

    const subscribe = () => {
      if (!contract) return () => {};
      const transferEvent = contract.filters.Transfer();
      contract.on(transferEvent, onBalanceChange);
      return () => {
        contract.off(transferEvent, onBalanceChange);
      };
    };

    load();
    return subscribe();
  }, [contract, address]);

  return {
    symbol,
    decimals,
    balance,
  };
};

export default useTokenInfo;
