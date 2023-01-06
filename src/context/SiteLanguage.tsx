import { useRouter } from "next/router"
import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react"
import { checkObjectHasField } from "^helpers/data"
import { Language } from "^types/entities"

const siteLanguageIds = ["english", "tamil"] as const
type SiteLanguageId = typeof siteLanguageIds[number]

type SiteLanguageHelper<TLanguage extends Language> = TLanguage

export type SiteLanguage = SiteLanguageHelper<
  { id: "english"; name: "English" } | { id: "tamil"; name: "Tamil" }
>

type RouterQuery = {
  id: string
  siteLanguageId?: SiteLanguageId
}

type Value = {
  siteLanguage: SiteLanguage
}

const Context = createContext({} as Value)

const SiteLanguageProvider = ({ children }: { children: ReactElement }) => {
  const [siteLanguage, setSiteLanguage] = useState<SiteLanguage>({
    id: "english",
    name: "English",
  })

  const router = useRouter()
  const routerQuery = router.query as RouterQuery

  useEffect(() => {
    const currentSiteLanguage: SiteLanguage =
      routerQuery.siteLanguageId === "tamil"
        ? { id: "tamil", name: "Tamil" }
        : { id: "english", name: "English" }

    setSiteLanguage(currentSiteLanguage)
  }, [routerQuery.siteLanguageId])

  return (
    <Context.Provider
      value={{
        siteLanguage,
      }}
    >
      {children}
    </Context.Provider>
  )
}

const useSiteLanguageContext = () => {
  const context = useContext(Context)
  const contextIsPopulated = checkObjectHasField(context)
  if (!contextIsPopulated) {
    throw new Error("useSiteLanguageContext must be used within its provider!")
  }
  return context
}

export { SiteLanguageProvider, useSiteLanguageContext }
