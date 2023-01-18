import { createContext, ReactElement, useContext } from "react"
import { checkObjectHasField } from "^helpers/data"

type Value = {
  isMultipleAuthors: boolean
}

const Context = createContext({} as Value)

const GlobalDataProvider = ({
  children,
  ...value
}: { children: ReactElement } & Value) => {
  return <Context.Provider value={value}>{children}</Context.Provider>
}

const useGlobalDataContext = () => {
  const context = useContext(Context)
  const contextIsPopulated = checkObjectHasField(context)
  if (!contextIsPopulated) {
    throw new Error("useGlobalDataContext must be used within its provider!")
  }
  return context
}

export { GlobalDataProvider, useGlobalDataContext }
