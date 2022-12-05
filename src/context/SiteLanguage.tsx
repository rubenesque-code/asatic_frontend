import { useRouter } from "next/router"
import { createContext, ReactElement, useContext } from "react"
import { checkObjectHasField } from "^helpers/data"
import { Language } from "^types/entities"

const siteLanguageIds = ["english", "tamil"] as const
type SiteLanguageId = typeof siteLanguageIds[number]

type SiteLanguageHelper<TLanguage extends Language> = TLanguage

export type SiteLanguage = SiteLanguageHelper<
  { id: "english"; name: "English" } | { id: "tamil"; name: "Tamil" }
>

type Value = {
  siteLanguage: SiteLanguage
  toggleSiteLanguage: () => void
}

const Context = createContext({} as Value)

const SiteLanguageProvider = ({ children }: { children: ReactElement }) => {
  const router = useRouter()
  const routerQueryLanguageId = router.query?.sitelang as
    | undefined
    | SiteLanguageId

  const siteLanguage: SiteLanguage =
    routerQueryLanguageId === "tamil"
      ? { id: "tamil", name: "Tamil" }
      : { id: "english", name: "English" }

  const toggleSiteLanguage = () => {
    router.push({
      ...router,
      query: {
        ...router.query,
        siteLanguageId: siteLanguage.id,
      },
    })
  }

  return (
    <Context.Provider
      value={{
        toggleSiteLanguage,
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
