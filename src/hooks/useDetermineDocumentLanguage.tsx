/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRouter } from "next/router"
import { siteLanguageIds } from "^constants/languages"
import { findEntityById, mapIds } from "^helpers/data"

import { Language } from "^types/entities"

type SiteLanguageId = typeof siteLanguageIds[number]

type RouterQuery = {
  id: string
  siteLanguageId?: SiteLanguageId
  documentLanguageId?: string
}

export const useDetermineDocumentLanguage = (documentLanguages: Language[]) => {
  const router = useRouter()
  const routerQuery = router.query as RouterQuery

  const documentLanguageIds = mapIds(documentLanguages)

  const documentLanguage =
    routerQuery.documentLanguageId &&
    documentLanguageIds.includes(routerQuery.documentLanguageId)
      ? findEntityById(documentLanguages, routerQuery.documentLanguageId)!
      : routerQuery.siteLanguageId &&
        documentLanguageIds.includes(routerQuery.siteLanguageId)
      ? findEntityById(documentLanguages, routerQuery.siteLanguageId)!
      : documentLanguages[0]

  return { documentLanguage }
}
