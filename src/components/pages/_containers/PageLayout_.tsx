import { ReactElement } from "react"
import tw from "twin.macro"
import Header from "^components/header"
import { GlobalDataProvider } from "^context/GlobalData"

import { useSiteLanguageContext } from "^context/SiteLanguage"
import { SanitisedSubject } from "^types/entities"

export const PageLayout_ = ({
  children: pageBody,
  staticData: { isMultipleAuthors, subjects, documentLanguageIds },
}: {
  children: ReactElement
  staticData: {
    isMultipleAuthors: boolean
    subjects: SanitisedSubject[]
    documentLanguageIds?: string[]
  }
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <GlobalDataProvider isMultipleAuthors={isMultipleAuthors}>
      <div
        css={[
          siteLanguage.id === "tamil"
            ? tw`font-serif-primary-tamil`
            : tw`font-serif-primary`,
        ]}
      >
        <Header subjects={subjects} documentLanguageIds={documentLanguageIds} />
        {pageBody}
      </div>
    </GlobalDataProvider>
  )
}
