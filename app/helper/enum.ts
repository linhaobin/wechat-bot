export function enumKeys<E>(enumValue: E): Array<keyof E> {
  return Object.keys(enumValue) as Array<keyof E>
}

type MapEnumResult<E> = { [K in keyof E]: { E } }
type MapFunc<E, R> = (key: keyof E) => R
type FilterFunc<E> = (key: keyof E) => any

export function enumMap<E, R>(enumValue: E, mapFunc: MapFunc<E, R>, filterFunc?: FilterFunc<E>): MapEnumResult<E> {
  let keys = enumKeys(enumValue)
  if (filterFunc) {
    keys = keys.filter(filterFunc)
  }
  return keys.reduce(
    (error, key) => ({
      ...error,
      [key]: mapFunc(key as keyof E)
    }),
    {}
  ) as MapEnumResult<E>
}
