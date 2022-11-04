export function compactUndefined(arr: any[]): any[] {
  return arr.filter((item) => typeof item !== 'undefined');
}
