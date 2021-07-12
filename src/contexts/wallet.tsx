import {
  FC,
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  useCallback,
} from 'react';
import { ethers } from 'ethers';
import { CACHE_WALLET_KEY, NETWORK_MAINNET } from 'config';
import cache from 'utils/cache';

const WalletContext = createContext<{
  network: string | null;

  signer: ethers.Signer | null;
  address: string | null;

  isConnecting: boolean;
  startConnecting: () => void;
  stopConnecting: () => void;
  disconnect: () => void;

  connectMetamask: () => void;
} | null>(null);

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const startConnecting = useCallback(() => setIsConnecting(true), [
    setIsConnecting,
  ]);
  const stopConnecting = useCallback(() => setIsConnecting(false), [
    setIsConnecting,
  ]);

  const setProvider = useCallback(
    async (web3Provider: any) => {
      web3Provider.on('accountsChanged', () => {
        window.location.reload();
      });
      web3Provider.on('chainChanged', () => {
        window.location.reload();
      });
      // web3Provider.on('disconnect', () => {
      //   disconnect();
      // });
      const provider = new ethers.providers.Web3Provider(web3Provider);

      const { name: network } = await provider.getNetwork();
      setNetwork(~['homestead'].indexOf(network) ? NETWORK_MAINNET : network);

      const signer = provider.getSigner();
      setSigner(signer);
      setAddress(await signer.getAddress());
      stopConnecting();
    },
    [stopConnecting]
  );

  const connectMetamask = useCallback(async () => {
    if (!window.ethereum) return;
    await window.ethereum.enable();
    cache(CACHE_WALLET_KEY, 'metamask');
    await setProvider(window.ethereum);
  }, [setProvider]);

  async function disconnect() {
    cache(CACHE_WALLET_KEY, null);
    setSigner(null);
    setAddress(null);
    setNetwork(null);
  }

  useEffect(() => {
    const load = async () => {
      if (address) return;

      const cachedWallet = cache(CACHE_WALLET_KEY);
      if (cachedWallet) {
        const c: Record<string, () => void> = {
          metamask: connectMetamask,
        };
        c[cachedWallet]?.();
      }
    };

    load();
  }, [address, connectMetamask]);

  return (
    <WalletContext.Provider
      value={{
        network,

        signer,
        address,

        isConnecting,
        startConnecting,
        stopConnecting,
        disconnect,

        connectMetamask,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('Missing Wallet context');
  }
  const {
    network,

    signer,
    address,

    isConnecting,
    startConnecting,
    stopConnecting,
    disconnect,

    connectMetamask,
  } = context;

  return {
    network,

    signer,
    address,

    isConnecting,
    startConnecting,
    stopConnecting,
    disconnect,

    connectMetamask,
  };
}
