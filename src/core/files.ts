import fs from "fs-extra"
import path from "path"
import ora from "ora"
import loadConfigFile from "@/loadConfigFile"
import xlsx from "node-xlsx"
import { Buffer } from "buffer"

const { formatKey, extract, compile } = global.config
const { output, input, languages, format, excludes, includes } = extract

export const writeFiles = async (values: Array<Record<string, string>>) => {
  const extractResult = {}
  values.forEach(({ id, defaultMessage }) => {
    const key = formatKey ? formatKey(id) : id
    extractResult[key] = defaultMessage || id
  })

  const languagesResult = languages.map(async lang => {
    const file = path.resolve(output, `${lang}.${format}`)
    if (fs.existsSync(file)) {
      const [sourceFile] = await loadConfigFile(file)
      const result = { ...extractResult, ...sourceFile }
      fs.copyFileSync(file, `${file}.bak`)
      return { lang, result, file }
    }
    return { file, lang, result: extractResult }
  })
  Promise.all(languagesResult).then(values => {
    // 找到最多key的语言
    const max = {
      length: 0,
      lang: ""
    }
    values
      .map(({ lang, result, file }) => {
        const length = Object.keys(result).length
        if (length > max.length) {
          max.length = length
          max.lang = lang
        }
        return { lang, result, file }
      })
      .map(({ lang, result, file }) => {
        // 如果最多的语言不是当前语言，则把当前语言的内容放到最多语言的文件中
        if (lang !== max.lang) {
          result = { ...values.find(({ lang: l }) => l === max.lang).result, ...result }
        }
        return { lang, result, file }
      })
      .map(({ lang, result, file }) => {
        // 写入文件
        let formatData = JSON.stringify(result, null, 2)
        if (format === "ts" || format === "js") {
          formatData = `export default ${formatData}`
        }
        fs.outputFile(file, formatData)
        return { lang, result, file }
      })

    outputExcel(values)
  })
}

function outputExcel(values) {
  const options = {
    "!cols": [{ wch: 30 }, { wch: 35 }, { wch: 35 }]
  }

  const header = values.map(({ lang }) => lang)
  const data = [["key", ...header]]

  Object.keys(values?.[0]?.result).forEach(key => {
    const row = [key]
    values.forEach(({ lang, result }, i) => {
      row.push(values[i].result[key])
    })
    data.push(row)
  })

  const buffer = xlsx.build([{ name: "test", data, options }]) // Returns a buffer
  const file = path.resolve(output, `languages.xlsx`)
  fs.outputFile(file, Buffer.from(buffer))
}

function walkSyncRead(currentDirPath, callback, excludes: string[] = []) {
  fs.readdirSync(currentDirPath).forEach(name => {
    if (!excludes.includes(name)) {
      const filePath = path.join(currentDirPath, name)
      const stat = fs.statSync(filePath)
      if (stat.isFile()) {
        callback(filePath, stat)
      } else if (stat.isDirectory()) {
        walkSyncRead(filePath, callback, excludes)
      }
    }
  })
}

export const readFiles = (): string[] => {
  const spinner = ora("read files...").start()

  const resust: string[] = []
  walkSyncRead(
    input,
    (filePath, stat) => {
      const extname = path.extname(filePath)
      includes.includes(extname) && resust.push(filePath)
    },
    excludes
  )
  spinner.succeed("read files succeed")
  return resust
}

export const readExcelFiles = (dirPath): any[] => {
  const spinner = ora("read excel files...").start()
  const filePath = path.join(dirPath)

  const [sheet1] = xlsx.parse(filePath)

  const { data: sheetData } = sheet1

  spinner.succeed("read excel files succeed")

  return sheetData
}

export const wirteExcelFileToJson = (data: any[]) => {
  const spinner = ora("write excel files to json...").start()
  const head = data.shift()
  // remove key
  head.shift()
  head.forEach((lang, index) => {
    const file = path.join(compile.output, `${lang}.${compile.format}`)
    const result = {}
    data.forEach(row => {
      const key = row[0]
      const value = row[index]
      result[key] = value
    })
    let formatData = JSON.stringify(result, null, 2)
    if (format === "ts" || format === "js") {
      formatData = `export default ${formatData}`
    }
    fs.outputFile(file, formatData)
  })

  spinner.succeed("write excel files to json succeed")
}
