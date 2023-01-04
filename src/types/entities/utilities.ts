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

//
type SetUnpickedKeysToUndefined<T, TValue> = {
  [P in keyof T]-?: T[P] extends TValue ? T[P] : undefined
}

type UndefinedKeys<T> = {
  [K in keyof T]: T[K] extends undefined ? K : never
}[keyof T]

type RemoveUndefinedFields<T extends Record<string, unknown>> = {
  [K in keyof Omit<T, UndefinedKeys<T>>]-?: T[K] extends infer R | undefined
    ? R
    : T[K]
}

type PickByValue<
  TObj extends Record<string, unknown>,
  TValue extends TObj[keyof TObj]
> = RemoveUndefinedFields<SetUnpickedKeysToUndefined<TObj, TValue>>

export type GetKeyByValue<
  TObj extends Record<string, unknown>,
  TValue extends TObj[keyof TObj]
> = keyof PickByValue<TObj, TValue>

type PickByValues<
  TObj extends Record<string, unknown>,
  TValue extends keyof TObj
> = RemoveUndefinedFields<SetUnpickedKeysToUndefined<TObj, TValue>>

export type GetKeysByValues<
  TObj extends Record<string, unknown>,
  TValues extends keyof TObj
> = keyof PickByValues<TObj, TValues>
