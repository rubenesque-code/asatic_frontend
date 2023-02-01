import { ComponentProps, ReactElement } from "react"
import tw from "twin.macro"

import { GlobalDataProvider } from "^context/GlobalData"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import Header from "^components/header"

import { MyOmit } from "^types/utilities"
import Head from "^components/Head"
import Footer from "^components/footer"

export const PageWrapper_ = ({
  children: pageBody,
  globalData,
  pageTitle,
}: {
  children: ReactElement | (ReactElement | null)[]
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
            tw`min-h-screen flex flex-col`,
            tw`dark:bg-white`,
          ]}
        >
          <Header />
          <div css={[tw`flex-grow`]}>{pageBody}</div>
          <Footer />
        </div>
      </GlobalDataProvider>
    </>
  )
}
