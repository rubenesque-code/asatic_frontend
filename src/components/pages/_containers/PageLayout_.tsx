import { ComponentProps, ReactElement } from "react"
import tw from "twin.macro"

import { GlobalDataProvider } from "^context/GlobalData"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import Header from "^components/header"

import { MyOmit } from "^types/utilities"
import Head from "^components/Head"

export const PageLayout_ = ({
  children: pageBody,
  globalData,
  pageTitle,
}: {
  children: ReactElement
  globalData: MyOmit<ComponentProps<typeof GlobalDataProvider>, "children">
  pageTitle?: string
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <>
      <Head pageTitle={pageTitle} />
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
    </>
  )
}
