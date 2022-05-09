import { createLogger, format, transports } from "winston"
import type { Logger } from "winston"
import PATH from "path"
import chalk from "chalk"

const log = (info: string, color: string = "blueBright") => {
  console.log("\n\r", chalk[color](info))
}

const { combine, timestamp, label, printf } = format

const myFormat = (isConsole?: boolean) =>
  printf(({ level, message, label, timestamp }) => {
    const { file, csl } = JSON.parse(message)
    const template = `${timestamp} [${label}] ${level}: ${isConsole ? csl : file}`
    return isConsole ? chalk.redBright(template) : template
  })

const formatConbine = (isConsole?: boolean) =>
  combine(label({ label: "logger" }), timestamp(), myFormat(isConsole))

let logger: Logger

const loggerInit = () => {
  logger = createLogger({
    format: formatConbine(),
    transports: [
      new transports.Console({
        format: formatConbine(true)
      }),
      new transports.File({
        filename: PATH.join(global.SysConfig.basePath, "zuoy.error.log"),
        level: "error"
      })
    ]
  })
}

const success: NodeJS.Global["log"]["success"] = info => {
  log(info, "greenBright")
}

const error: NodeJS.Global["log"]["error"] = error => {
  if (typeof error === "string") {
    log(error, "redBright")
  } else {
    if (!logger) {
      loggerInit()
    }
    const { title, path, detail = "", position } = error
    const posStr = position ? `${position.line}:${position.column}` : ""
    const template = (p = "") => `
    ${title}
      [${posStr}]${p}:${posStr}
      ${detail}
    `
    logger.log(
      "error",
      JSON.stringify({
        file: template(path),
        csl: template(path ? PATH.relative(global.SysConfig.basePath, path) : "")
      })
    )
  }
}

const warn: NodeJS.Global["log"]["warn"] = info => {
  log(info, "yellowBright")
}

export default {
  success,
  error,
  warn,
  info: log
} as NodeJS.Global["log"]
