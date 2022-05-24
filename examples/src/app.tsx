import { useState, useEffect } from "react"
import { Select } from "antd"

export default function IndexPage() {
  const { formatMessage } = useIntl()
  const useTranslation = () => {
    const intl = useIntl()
    return (id: string, defaultMessage?: string, values?: Values) =>
      intl.formatMessage({ id, defaultMessage }, values)
  }
  const t = useTranslation()

  return (
    <div style={{ margin: 24 }}>
      <br />
      {t("你好, {name}", "123", { name: "aaa" })}
      <br />
      {formatMessage({ id: "hello", defaultMessage: "你好, {name}" }, { name: "name" })}
      {t("name", "ddd", { name: "bbbb" })}
    </div>
  )
}
