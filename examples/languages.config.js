export default {
  // 未启用翻译的其他语言默认填入的内容
  // defaultContent: (value, code) => {
  //   return `${code}_${value}`;
  // },
  additionalFunctionNames: ["t"],
  additionalFunctionAst: node => {
    const properties = node.arguments
    if (properties?.[0]?.value) {
      const params = {
        id: properties?.[0].value,
        defaultMessage: properties?.[1]?.value || properties?.[0]?.value
      }
      return params
    }
  },
  extract: {
    input: "./src",
    output: "./locales",
    includes: [".ts", ".tsx", ".js", ".jsx"],
    excludes: [".umi", "typings.d.ts", "API.d.ts"],
    format: "ts",
    languages: ["zh-CN", "en-US"]
  }
}
