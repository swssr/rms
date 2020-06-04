//Utility functions
export function findByKey(_key: any, _query: string, list: any) {
  return list
    .filter((value: any) => value[_key].toLowerCase().startsWith(_query))
}

export function withinRange(value: number, center: number, offset: number) {
  const min = center - offset;
  const max = center + offset;
  if (value > max || value < min) { return false } else {
    return true
  }
}