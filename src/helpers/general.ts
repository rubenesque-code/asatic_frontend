export function filterArrAgainstControl<TItem extends string | number>(
  arr: TItem[],
  controlArr: TItem[]
) {
  return arr.filter((item) => controlArr.includes(item))
}

export function removeArrDuplicates<TItem extends string | number>(
  arr: TItem[]
) {
  return [...new Set(arr)]
}
