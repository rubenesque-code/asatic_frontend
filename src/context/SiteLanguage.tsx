import { useRouter } from 'next/router'
import { createContext, ReactElement, useContext } from 'react'
import { checkObjectHasField } from '^helpers/data'

const siteLanguages = ['english', 'tamil'] as const
type SiteLanguage = typeof siteLanguages[number]

type Value = {
  siteLanguage: SiteLanguage
  toggleSiteLanguage: () => void
}

const Context = createContext({} as Value)

// todo: should just be hook?

const SiteLanguageProvider = ({ children }: { children: ReactElement }) => {
  const router = useRouter()
  const routeQueryLanguage = router.query?.sitelang as undefined | string

  const siteLanguage = !siteLanguages.find(
    (siteLanguage) => siteLanguage === routeQueryLanguage
  )
    ? 'english'
    : (routeQueryLanguage as SiteLanguage)

  const toggleSiteLanguage = () => {
    router.push({
      ...router,
      query: {
        ...router.query,
        sitelang: siteLanguage === 'english' ? 'tamil' : 'english',
      },
    })
  }

  return (
    <Context.Provider value={{ toggleSiteLanguage, siteLanguage }}>
      {children}
    </Context.Provider>
  )
}

const useSiteLanguageContext = () => {
  const context = useContext(Context)
  const contextIsPopulated = checkObjectHasField(context)
  if (!contextIsPopulated) {
    throw new Error('useSiteLanguageContext must be used within its provider!')
  }
  return context
}

export { SiteLanguageProvider, useSiteLanguageContext }
