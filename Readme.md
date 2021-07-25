# Witstap Staking

Stake eWIT-USDC UNI V3 nfts to earn additional rewards. This frontend is generic and can be used by any other pool that wishes to perform liquidity mining via the [UNI v3 staker contract](https://github.com/Uniswap/uniswap-v3-staker).

## Getting started

#### Configuration

- Deploy the staker contract.
- Deploy the [subgraph](https://github.com/vbstreetz/witswap-staking-subgraph) to index data.
- Update the config at `src/config.tsx` accordingly.

### Run

- Copy `.env.local.sample` to `.env.local` and configure.
- Run `make` to start the app.
- Visit the dapp at http://localhost:7373

## Stack

- [React](https://reactjs.org/)
- [Material UI](https://material-ui.com/)
