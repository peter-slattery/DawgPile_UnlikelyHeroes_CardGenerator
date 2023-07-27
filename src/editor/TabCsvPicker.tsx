import React from "react"
import { AppContext } from "./App"
import { MessageCsvList } from "../shared/messages"
import { createUseStyles } from "react-jss"

export const TabCsvPicker: React.FC = () => {
  const appCtx = React.useContext(AppContext)
  const styles = useStyles()

  const [ files, filesSet ] = React.useState<string[]>([])

  const fileListSet = (event: MessageEvent<any>) => {
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
    <div className={styles.outer}>
      { 
        files.map((file, i) => (
          <button key={i} onClick={() => appCtx.focusedCsvSet(file)}>
            {file}
          </button>
        ))
      }
    </div>
  )
}

const useStyles = createUseStyles({
  outer: {
    display: "flex",
    flexDirection: "column",
  }
})