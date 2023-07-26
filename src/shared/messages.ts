
export type MessageCsvGetAll = { type: "CSV_GET_LIST" }
export type MessageCsvCreate = { type: "CSV_CREATE", filename: string }
export type MessageCsvSave   = { type: "CSV_SAVE", filename: string, content: string }

export type MessageCsvList = { type: "CSV_LIST", files: string[] }

export type Message = 
  MessageCsvGetAll |
  MessageCsvCreate |
  MessageCsvSave

export type MessageType = Message["type"]

export type MessageHeader = {
  type: MessageType;
}