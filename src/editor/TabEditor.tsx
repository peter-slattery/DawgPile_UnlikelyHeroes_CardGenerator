import React, { useEffect } from "react"
import { SpreadsheetEditor } from "./SpreadsheetEditor"
import { AppContext } from "./App"
import { Message, MessageCsvData } from "../shared/messages"

const TEST_DATA = [
  { a: "foo", b: "hi there", c: "well then" },
  { a: "foo", b: "hi there", c: "well then" },
  { a: "foo", b: "hi there", c: "well then" },
  { a: "foo", b: "hi there", c: "well then" },
  { a: "foo", b: "hi there", d: "well then" },
]

export const TabEditor: React.FC = () => {
  const appCtx = React.useContext(AppContext)
  const [ data, dataSet ] = React.useState<object[]>(TEST_DATA)

  const handleMessageCsvData = (event: MessageEvent<any>) => {
    const data = JSON.parse(event.data) as MessageCsvData
    dataSet(data.content)
  }

  useEffect(() => {
    appCtx.ws.addEventListener("message", handleMessageCsvData)
    const message: Message = {
      type: "CSV_GET",
      filename: appCtx.focusedCsv,
    }
    appCtx.ws.send(JSON.stringify(message))
    return () => {
      appCtx.ws.removeEventListener("message", handleMessageCsvData)
    }
  }, [ appCtx.focusedCsv])

  const updateTableData = (newData: object[]) => {
    dataSet(newData as any)

    const message: Message = {
      type: "CSV_DATA",
      filename: appCtx.focusedCsv,
      content: newData,
    }
    appCtx.ws.send(JSON.stringify(message))
  }
  
  return (
    <SpreadsheetEditor 
      rows={data}
      updateTableData={updateTableData}
    />
  )
}