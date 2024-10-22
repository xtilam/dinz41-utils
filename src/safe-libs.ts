export function getLibs<T extends Record<string, () => any>>(getLibs: T) {
  const errorMap = {} as any;
  let hasError = false;
  const mapResult = {} as { [n in keyof T]: ReturnType<T[n]> };
  for (const libKey in getLibs) {
    try {
      mapResult[libKey] = getLibs[libKey]();
    } catch (error) {
      hasError = true;
      errorMap[libKey] = `${error}`;
    }
  }
  if (!hasError) return mapResult;

  const errorConcat: string[] = ["Missing packages:"];
  for (const lib in errorMap) {
    errorConcat.push(`--------------------------------`);
    errorConcat.push(`${errorMap[lib]}`);
  }
  throw new Error(errorConcat.join("\n"));
}
