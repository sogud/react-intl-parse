import fs from "fs-extra"
import path from "path"
import ora from "ora"
import loadConfigFile from "@/loadConfigFile"

const { formatKey, extract } = global.config
const { output, input, languages, format, excludes, includes } = extract

export const writeFiles = async (values: Array<Record<string, string>>) => {
  let data = {}
  values.forEach(({ id, defaultMessage }) => {
    const key = formatKey ? formatKey(id) : id
    data[key] = defaultMessage || id
  })

  languages.forEach(async lang => {
    const file = path.resolve(output, `${lang}.${format}`)
    if (fs.existsSync(file)) {
      const [sourceFile] = await loadConfigFile(file)
      data = Object.assign(data, sourceFile)
      fs.copyFileSync(file, `${file}.bak`)
    }
    let formatData = JSON.stringify(data, null, 2)
    if (format === "ts" || format === "js") {
      formatData = `export default ${formatData}`
    }
    fs.outputFile(file, formatData)
  })
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
