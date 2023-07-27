
export type MessageCsvGetAll = { type: "CSV_GET_LIST" }
export type MessageCsvGet    = { type: "CSV_GET", filename: string }
export type MessageCsvCreate = { type: "CSV_CREATE", filename: string }
export type MessageCsvSave   = { type: "CSV_SAVE", filename: string, content: string }

export type MessageCsvList = { type: "CSV_LIST", files: string[] }
export type MessageCsvData = { type: "CSV_DATA", filename: string, content: object[] }

export type Message = 
  MessageCsvGetAll |
  MessageCsvGet    |
  MessageCsvCreate |
  MessageCsvSave   |
  MessageCsvList   |
  MessageCsvData   

export type MessageType = Message["type"]

export type MessageHeader = {
  type: MessageType;
}