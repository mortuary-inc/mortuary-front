let promiseByKey = new Map<string, Promise<any>>();

export async function doSingleLoad<D>(key: string, loader: () => Promise<D>): Promise<D> {
  let promise = promiseByKey.get(key);
  if (promise) {
    // similar call already triggered
    let data = await promise;
    return data as D;
  }

  let p = loader();
  promiseByKey.set(key, p);
  let d = await p;
  promiseByKey.delete(key);
  return d;
}