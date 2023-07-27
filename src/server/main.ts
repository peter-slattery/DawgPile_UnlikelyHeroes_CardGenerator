import fs from "fs"
import path from "path"
import { WebSocketServer, WebSocket } from "ws"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

import { MessageType, MessageHeader, Message, MessageCsvList, MessageCsvGet, MessageCsvData } from "../shared/messages";
import { genAllDecks } from "./gen"

const DATA_PATH = path.resolve(process.cwd(), "data")

const wss = new WebSocketServer({ port: 8080 })

const sendError = (ws: WebSocket, error: string) => {
  ws.send(JSON.stringify({
    type: "ERROR",
    error
  }))
}

const messageHandlers: Record<MessageType, (data: Message, ws: WebSocket) => void> = {
  "CSV_GET_LIST": (data, ws) => {
    fs.readdir(DATA_PATH, (err, files) => {
      if (err) {
        sendError(ws, err.message)
        return
      }
      const msg: MessageCsvList = {
        type: "CSV_LIST",
        files: files.filter(f => f.endsWith(".csv"))
      }
      ws.send(JSON.stringify(msg))
    })
  },
  "CSV_GET": (data, ws) => {
    const { filename } = data as MessageCsvGet
    fs.readFile(path.resolve(DATA_PATH, filename), async (err, content) => {
      if (err) {
        sendError(ws, err.message)
        return
      }
      const csv = content.toString()
      const rows = await parse(csv, { columns: true, skip_empty_lines: true, delimiter: "," })
      const msg: Message = {
        type: "CSV_DATA",
        filename,
        content: rows
      }
      ws.send(JSON.stringify(msg))
    })
  },
  "CSV_CREATE": (data, ws) => {
    ws.send(data.type)
  },
  "CSV_SAVE": (data, ws) => {
    ws.send(data.type)
  },
  "CSV_LIST": (d, w) => {},
  "CSV_DATA": async (d, w) => {
    const data = d as MessageCsvData
    const str = await stringify(data.content, { 
      delimiter: ",",
      header: true,
    })
    fs.writeFile(path.resolve(DATA_PATH, data.filename), str, (err) => {
      if (err) {
        sendError(w, err.message)
        return
      }
      genAllDecks()
    })
  },
}

wss.on('connection', function connection(ws) {
  console.log("Connection")
  ws.on('error', console.error);

  ws.on('message', function message(bytes) {
    const data = JSON.parse(bytes.toString()) as MessageHeader
    console.log("Message", data.type)
    if (messageHandlers[data.type]) messageHandlers[data.type](data as Message, ws)
  });
});