import React, { useState, useEffect, useContext } from "react"
import { createUseStyles } from "react-jss"

type TableContextProps = {
  editCell: (row: number, column: string, newValue: string) => void,
}
const TableContext = React.createContext<TableContextProps>({
  editCell: () => {},
})

type Props = {
  rows: object[],
  updateTableData: (newData: object[]) => void,
}

export const SpreadsheetEditor: React.FC<Props> = (props) => {
  const styles = useStyles()

  const getColumnTitles = (rows: object[]): string[] => {
    const columns: Record<string, boolean> = {}
    for (let row_i = 0; row_i < rows.length; row_i++) {
      const keys = Object.keys(rows[row_i])
      for (let key_i = 0; key_i < keys.length; key_i++) {
        const key = keys[key_i]
        columns[key] = true
      }
    }
    return Object.keys(columns)
  }

  const tableAddRow = () => {
    const newRows = [...props.rows]
    newRows.push({})
    props.updateTableData(newRows)
  }

  // TODO: Memoize?
  const columnTitles = getColumnTitles(props.rows)

  const ctx: TableContextProps = {
    editCell: (row, column, newValue) => {
      const newRows = [...props.rows]
      newRows[row][column] = newValue
      props.updateTableData(newRows)
    }
  }

  return (
    <TableContext.Provider value={ctx}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th key={-1}>#</th>
            {columnTitles.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, row_i) => (
            <tr key={row_i}>
              <TableCell key={-1} row={-1} column="#" value={row_i} />
              {columnTitles.map((column, index) => (
                <TableCell key={index} row={row_i} column={column} value={row[column]} editable />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={tableAddRow}>Add Row</button>
    </TableContext.Provider>
  )
}

type TableCellProps = {
  row: number,
  column: string,
  value: string | number,
  editable?: true
}
const TableCell: React.FC<TableCellProps> = (props) => {
  const { editCell } = useContext(TableContext)
  if (!props.editable) 
  {
    return (<td><span>{props.value}</span></td>)
  } 
  else 
  {
    const value = props.value ?? ""
    return (
      <td>
        <input 
          type="text" 
          value={value} 
          onChange={(event) => {
            if (event.target.value === props.value) return
            editCell(props.row, props.column, event.target.value)
          }} 
        />
      </td>
    )
  }
}

const useStyles = createUseStyles({
  table: {
    borderSpacing: "0px",
    borderLeft: "1px solid black",
    borderTop: "1px solid black",
    width: "100%",
    height: "100%",
    "& td,th": {
      borderRight: "1px solid black",
      borderBottom: "1px solid black",
    },
    "& input": { 
      border: "none",
      outline: "none",
      background: "none",
    }
  }
})