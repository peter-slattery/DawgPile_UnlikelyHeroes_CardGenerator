import React from "react"

export function createContext<TProps>() {
  return React.createContext<TProps>({} as TProps)
}