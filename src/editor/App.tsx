import React from "react"
import { SpreadsheetEditor } from "./SpreadsheetEditor"
import { CsvPicker } from "./CsvPicker"
import { createContext } from "./createContext"

const TEST_DATA = [
  { a: "foo", b: "hi there", c: "well then" },
  { a: "foo", b: "hi there", c: "well then" },
  { a: "foo", b: "hi there", c: "well then" },
  { a: "foo", b: "hi there", c: "well then" },
  { a: "foo", b: "hi there", d: "well then" },
]

type AppContextProps = {
  ws: WebSocket,
}
export const AppContext = createContext<AppContextProps>()

export const App: React.FC = () => {
  const [ ws, wsSet ] = React.useState<WebSocket | null>(null)
  const [ data, dataSet ] = React.useState(TEST_DATA)

  const webSocketInit = () => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.addEventListener("open", () => {
      wsSet(socket)
    })
  }

  React.useEffect(() => {
    webSocketInit()
  }, [])

  const updateTableData = (newData: object[]) => {
    dataSet(newData as any)
  }

  // TODO: Loading 
  if (!ws) return null

  return (
    <AppContext.Provider value={{ ws }}>
      <div>
        <CsvPicker />
      </div>
    </AppContext.Provider>
  )
}