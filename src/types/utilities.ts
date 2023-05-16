/* eslint-disable @typescript-eslint/no-explicit-any */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T

export type ValueOf<T> = T[keyof T]

export type ActionWithArg<T> = (arg: T) => void
export type ActionNoArg = () => void

type OmitId<T extends { id: string }> = Omit<T, "id">
type OmitIdAndTranslationId<T extends { id: string; translationId: string }> =
  Omit<T, "id" | "translationId">

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionPayloadNoId<T extends (...args: any) => any> = OmitId<
  Parameters<T>[0]
>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionPayloadNoIdNorTranslationId<T extends (...args: any) => any> =
  OmitIdAndTranslationId<Parameters<T>[0]>

// export type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type MyOmit<T, K extends keyof T> = HandleEmptyObject<
  Pick<T, Exclude<keyof T, K>>
>

export type HandleEmptyObject<T> = T extends Record<string, never> ? void : T

export type OmitFromMethods<TObj, TProps extends string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof TObj]: TObj[K] extends (...args: any) => void
    ? (arg: MyOmit<Parameters<TObj[K]>[0], TProps>) => void
    : never
}

export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>

export type MyExtract<T, U extends T> = T extends U ? T : never

export type TupleToUnion<T extends unknown[]> = T[number]

export type FilterTuple<
  TTuple extends unknown[],
  TMember extends TTuple[number]
> = TTuple extends []
  ? []
  : TTuple extends [infer H, ...infer R]
  ? H extends TMember
    ? [H, ...FilterTuple<R, TMember>]
    : FilterTuple<R, TMember>
  : TTuple

export type OverwriteInterface<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type MakeRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type DeepRequired<T, P extends string[]> = T extends object
  ? Omit<T, Extract<keyof T, P[0]>> &
      Required<{
        [K in Extract<keyof T, P[0]>]: NonNullable<
          DeepRequired<T[K], ShiftUnion<K, P>>
        >
      }>
  : T

type Shift<T extends any[]> = ((...t: T) => any) extends (
  first: any,
  ...rest: infer Rest
) => any
  ? Rest
  : never

type ShiftUnion<P extends PropertyKey, T extends any[]> = T extends any[]
  ? T[0] extends P
    ? Shift<T>
    : never
  : never
