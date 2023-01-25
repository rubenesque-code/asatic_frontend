import { ComponentProps, ReactElement } from "react"
import tw from "twin.macro"

import { GlobalDataProvider } from "^context/GlobalData"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import Header from "^components/header"

import { MyOmit } from "^types/utilities"

export const PageLayout_ = ({
  children: pageBody,
  globalData,
}: {
  children: ReactElement
  globalData: MyOmit<ComponentProps<typeof GlobalDataProvider>, "children">
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <GlobalDataProvider {...globalData}>
      <div
        css={[
          siteLanguage.id === "tamil"
            ? tw`font-serif-primary-tamil`
            : tw`font-serif-primary`,
        ]}
      >
        <Header />
        {pageBody}
      </div>
    </GlobalDataProvider>
  )
}
