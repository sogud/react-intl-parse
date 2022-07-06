import { readExcelFiles, wirteExcelFileToJson } from "./files"
const { compile: config } = global.config
const { input } = config

const compile = async () => {
  const excelData = readExcelFiles(input)
  wirteExcelFileToJson(excelData)
}

export default compile
