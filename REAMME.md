### react-intl-parse 基于AST 国际化语法提取与编译辅助工具


#### 配置示例


``` javascript
 module.exports = {
  additionalFunctionNames: ['t'],
  // 提取t函数的ast逻辑
  additionalFunctionAst: (node) => {
    const properties = node.arguments;
    if (properties?.[0]?.value) {
      const params = {
        id: properties?.[0].value,
        defaultMessage: properties?.[1]?.value || properties?.[0]?.value,
      };
      return params;
    }
  },
  extract: {
    input: './src',
    output: './src/locales',
    includes: ['.ts', '.tsx', '.js', '.jsx'],
    excludes: ['.umi', 'typings.d.ts', 'API.d.ts'],
    format: 'ts',
    languages: ['zh-CN', 'en-US'],
  },
  compile: {
    input: './languages.xlsx',
    output: './locales',
    format: 'ts',
    languages: ['zh-CN', 'en-US'],
  },
};


```


#### 使用示例


```bash
react-intl-parse extract

react-intl-parse compile

```