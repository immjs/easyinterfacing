export type TLBRKeys = 'top'
| 'bottom'
| 'left'
| 'right' // TODO: make use of the following
| 'topleft'
| 'topright'
| 'horizontal'
| 'vertical'
| 'bottomleft'
| 'bottomright';

export type Tuple<T, N extends number, A extends unknown[] = []> = A extends {
  length: N
}
  ? A
  : Tuple<T, N, [...A, T]>

export type Pair<T> = Tuple<T, 2>;
export type MaybePair<T> = T | [T] | Pair<T>;
export type MaybeArray<T> = T | T[];
export type Nullish<T> = T | null | undefined;
export const isNullish = (v: any) => v == null;

export const stackTrace = () => {
  const err = new Error();
  return err.stack;
};

export class EIError extends Error {
  constructor(message: string) {
    super(`[EasyInterfacing] ${message}`);
  }
}
