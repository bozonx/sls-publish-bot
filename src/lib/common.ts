
export function isPromise(toCheck: any): boolean {
  return toCheck
    && typeof toCheck === 'object'
    && typeof toCheck.then === 'function'
    || false
}

export function ignorePromiseError(promise: Promise<any>) {
  promise.catch((e: Error) => {});
}
