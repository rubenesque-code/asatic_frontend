import { createContext, ReactElement, useContext } from "react"
import { checkObjectHasField } from "^helpers/data"
import { processSubjectsAsLinks } from "^helpers/process-fetched-data/subject/process"

type Value = {
  isMultipleAuthors: boolean
  subjects: ReturnType<typeof processSubjectsAsLinks>
  isCollection: boolean
  documentLanguageIds?: string[]
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
export type GlobalDataValue = Value
