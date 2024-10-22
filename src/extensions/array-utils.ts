export default () => ({
  iter: {
    map: iterMap,
  },
});
// ----------------------------------------------
function iterMap<T, L>(
  iter: IterableIterator<T>,
  callback: (item: T, idx: number) => L
): L[] {
  const result = [];
  while (true) {
    const v = iter.next();
    if (v.done) break;
    result.push(callback(v.value, result.length));
  }

  return result;
}
