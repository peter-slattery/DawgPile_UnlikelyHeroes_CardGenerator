import React from "react"
import { createContext } from "./createContext"

import { TabCsvPicker } from "./TabCsvPicker"
import { TabEditor } from "./TabEditor"
import { TabView } from "./TabView"

type AppContextProps = {
  ws: WebSocket,
  focusedCsv: string,
  focusedCsvSet: (csv: string) => void,
}
export const AppContext = createContext<AppContextProps>()

export const App: React.FC = () => {
  const [ ws, wsSet ] = React.useState<WebSocket | null>(null)
  const [ focusedCsv, focusedCsvSet ] = React.useState<string>("")
  const [ activeTabIndex, activeTabIndexSet ] = React.useState<number>(0)

  const webSocketInit = () => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.addEventListener("open", () => {
      wsSet(socket)
    })
  }

  React.useEffect(() => {
    webSocketInit()
  }, [])

  // TODO: Loading?
  if (!ws) return null

  const ctx: AppContextProps = {
    ws,
    focusedCsv, 
    focusedCsvSet: (csv: string) => {
      focusedCsvSet(csv),
      activeTabIndexSet(1)
    }
  }

  return (
    <AppContext.Provider value={ctx}>
      <TabView
        activeTabIndex={activeTabIndex}
        activeTabIndexSet={activeTabIndexSet}
        tabs={[
          { title: "CSVs", component: TabCsvPicker },
          { title: "Editor", component: TabEditor }
        ]}
      />
    </AppContext.Provider>
  )
}