export default {
  localLanguage: 'zh',
  defaultContent: (value) => value.toLocaleString(),
  // formatKey: value => value.toLocaleString(),
  additionalFunctionNames: ['t', '$t'],
  extract: {
    input: './src',
    output: './locales',
    includes: ['.ts', '.tsx', '.js', '.jsx'],
    excludes: ['.umi'],
    format: 'json',
    languages: ['zh-CN', 'en-US']
  }
};
