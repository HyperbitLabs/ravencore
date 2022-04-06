export function isString(x?: any): boolean {
  return Object.prototype.toString.call(x) === '[object String]';
}
