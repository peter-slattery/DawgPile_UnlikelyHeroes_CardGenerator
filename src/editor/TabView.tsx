import React from "react"
import { createUseStyles } from "react-jss"
import classNames from "classnames"

type Tab = {
  title: string,
  component: React.FC
}

type Props = {
  tabs: Tab[],
  activeTabIndex: number,
  activeTabIndexSet: (index: number) => void,
}

export const TabView: React.FC<Props> = ({ tabs, activeTabIndex, activeTabIndexSet }) => {
  const styles = useStyles()

  React.useEffect(() => {
    if (activeTabIndex >= tabs.length) {
      activeTabIndexSet(0)
    }
  }, [ tabs, activeTabIndex])

  if (tabs.length === 0) return null

  const ActiveComponent = tabs[activeTabIndex].component

  return (
    <div className={styles.outer}>
      <div className={styles.header}>
        {
          tabs.map((tab, i) => (
            <button
              className={classNames(styles.tabButton, {
                [styles.tabButtonActive]: i === activeTabIndex
              })} 
              key={tab.title}
              onClick={() => activeTabIndexSet(i)}
            >
              {tab.title}
            </button>
          ))
        }
      </div>
      <div className={styles.content}>
        <ActiveComponent />
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  outer: {
    width: "100%",
    height: "100%",
  },
  header: {
    width: "100%",
    display: "flex",
    border: "1px solid black",
    marginBottom: 4,
  },
  tabButton: {
    border: "1px solid black",
    padding: 4,
  },
  tabButtonActive: {
    backgroundColor: "lightgray",
  },
  content: {},
})