import { Command } from "commander"
import initialize, { pkg } from "../initConfig"

const main = async () => {
  await initialize()
  const program = new Command()

  program.version(pkg.version, "-v, -V, --version")
  program.option("-c").action(() => {
    // 打印命令行输入的值
    console.log(global.config)
  })

  program
    .command("extract [path]")
    .description("extract...")
    .action(async (path: string) => {
      const { default: extract } = await import("../core/extract")
      await extract()
    })

  await program.parseAsync(process.argv)
}

export default main
