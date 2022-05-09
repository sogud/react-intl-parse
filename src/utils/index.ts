// 对象深合并算法
export const deepAssign = <T>(...objs: any[]) => {
  const obj = objs[0]
  for (let i = 1, len = objs.length; i < len; i += 1) {
    for (const key in objs[i]) {
      obj[key] =
        obj[key] &&
        obj[key].toString() === "[object Object]" &&
        objs[i][key] &&
        objs[i][key].toString() === "[object Object]"
          ? deepAssign<T>(obj[key], objs[i][key])
          : (obj[key] = objs[i][key])
    }
  }
  return obj as T
}
