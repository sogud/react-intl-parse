declare module "*.css"
declare module "*.less"
declare module "*.png"
declare module "*.svg" {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement
  const url: string
  export default url
}

namespace NodeJS {
  interface Global {
    config: {
      localLanguage?: string

      defaultContent?: (value: string, targetCode: string) => string

      formatKey?: (value: string | number | boolean) => string

      [key: string]: any
    }

    log: {
      info: (info: string, color?: string) => void
      success: (info: string) => void
      warn: (info: string) => void
      error: (
        error:
          | string
          | {
              title: string
              path?: string
              detail?: string
              position?: { line: number; column: number }
            }
      ) => void
    }
    [key: string]: any
  }
}
