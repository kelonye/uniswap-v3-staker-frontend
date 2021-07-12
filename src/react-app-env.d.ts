/// <reference types="react-scripts" />

import * as ethers from 'ethers';

declare module 'immutable-tuple';

declare global {
  interface Window {
    web3?: {
      eth?: {
        net: {
          getId: () => any;
        };
      };
      version: {
        getNetwork(cb: (err: Error | undefined, networkId: any) => void): void;
        network: any;
      };
    };
    ethereum?: {
      on: (event: string, cb: () => void) => void;
      ethereum: ethers.providers.Provider | undefined;
      networkVersion: any;
      isMetaMask: boolean;
      enable: () => void;
    };
  }
}
