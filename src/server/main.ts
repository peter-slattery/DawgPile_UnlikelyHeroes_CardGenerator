import fs from "fs"
import path from "path"
import { WebSocketServer, WebSocket } from "ws"

import { MessageType, MessageHeader, Message, MessageCsvList } from "../shared/messages";

const DATA_PATH = path.resolve(process.cwd(), "data")

const wss = new WebSocketServer({ port: 8080 })

const messageHandlers: Record<MessageType, (data: Message, ws: WebSocket) => void> = {
  "CSV_GET_LIST": (data, ws) => {
    fs.readdir(DATA_PATH, (err, files) => {
      if (err) {
        ws.send(JSON.stringify({
          type: "ERROR",
          error: err
        }))
        return
      }
      const msg: MessageCsvList = {
        type: "CSV_LIST",
        files: files.filter(f => f.endsWith(".csv"))
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