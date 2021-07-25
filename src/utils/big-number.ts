import BigNumber from 'bignumber.js';

const PRECISION = 4;

export function toFixed(a: any, b: any, precision?: number) {
  if (toBigNumber(a).isZero() || toBigNumber(b).isZero()) {
    return '0';
  }
  return toBigNumber(a)
    .div(toBigNumber(b))
    .toFormat(precision ?? PRECISION);
}

export function formatUnits(
  a: any,
  decimals: number | null,
  precision?: number
) {
  if (!decimals) return '';
  return toFixed(a, toBigNumber(10).pow(decimals), precision);
}

export function toBigNumber(n: any) {
  return new BigNumber(n.toString());
}
