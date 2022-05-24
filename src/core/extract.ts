import parser from "@babel/parser"
import type { NodePath } from "@babel/traverse"
import traverse from "@babel/traverse"
import chalk from "chalk"
import cliProgress from "cli-progress"
import fs from "fs-extra"
import ora from "ora"
import { readFiles, writeFiles } from "./files"
const { additionalFunctionNames, additionalFunctionAst } = global.config
export const collectValues = (fileName: string) => {
  const fileRaw = fs.readFileSync(fileName, { encoding: "utf-8" })

  try {
    const ast = parser.parse(fileRaw, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "estree"]
    })

    const values: Array<Record<string, string>> = []
    traverse(ast, {
      CallExpression(path: NodePath<any>) {
        const { node } = path
        const { name } = node.callee ?? {}
        if (additionalFunctionNames.includes(name)) {
          const getValue = node => {
            if (additionalFunctionAst) {
              return additionalFunctionAst(node)
            }
            const { properties = [] } = node.arguments?.[0] ?? {}
            if (properties?.length) {
              let params = {}
              properties?.forEach(({ key, value }) => {
                if (key.name) {
                  params[key?.name] = value.value || key?.name
                }
              })
              return params
            }
          }
          const value = getValue(node)
          value && values.push(value)
        }
      }
    })

    return values
  } catch (error: any) {
    global.log.error({ title: "AST Parse Error", path: fileName, position: error.loc })
    throw new Error("AST Parse Error")
  }
}

const extract = async () => {
  const paths = readFiles()

  // get all values
  const bar = new cliProgress.SingleBar({
    format: `${chalk.cyan("{bar}")} {percentage}% {value}/{total} {current}`
  })
  bar.start(paths.length, 0, { current: "" })
  const values = paths.reduce((prev: Array<Record<string, string>>, current: string) => {
    bar.increment(1, { current })
    return prev.concat(collectValues(current))
  }, [])
  bar.increment(0, { current: "done" })
  bar.stop()

  const spinner = ora("write files...").start()
  await writeFiles(values)
  spinner.succeed("write files succeed")
}

export default extract
