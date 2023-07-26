import React from "react"
import { AppContext } from "./App"
import { MessageCsvList } from "../shared/messages"

export const CsvPicker: React.FC = () => {
  const appCtx = React.useContext(AppContext)

  const [ files, filesSet ] = React.useState<string[]>([])

  const fileListSet = (event: MessageEvent<any>) => {
    console.log("!!")
    const data = JSON.parse(event.data)
    if (data.type === "CSV_LIST") {
      filesSet((data as MessageCsvList).files)
    }
  }

  React.useEffect(() => {
    appCtx.ws.addEventListener("message", fileListSet);
    appCtx.ws.send(JSON.stringify({ type: "CSV_GET_LIST" }))
    return () => {
      appCtx.ws.removeEventListener("message", fileListSet)
    }
  }, [])

  return (
    <div>
      { files.map((file, i) => <div key={i}>{file}</div>) }
    </div>
  )
}