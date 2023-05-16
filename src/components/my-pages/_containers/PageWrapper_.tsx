import { ComponentProps, ReactElement, useRef } from "react"
import tw from "twin.macro"

import { GlobalDataProvider } from "^context/GlobalData"
import { useSiteLanguageContext } from "^context/SiteLanguage"

import Header from "^components/header"

import { MyOmit } from "^types/utilities"
import Head from "^components/Head"
import Footer from "^components/footer"
import { usePrevious, useWindowScroll, useWindowSize } from "react-use"

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

  const headerRef = useRef<HTMLDivElement | null>(null)
  const headerHeight = headerRef?.current?.getBoundingClientRect().height

  const { y: currentY } = useWindowScroll()
  const previousY = usePrevious(currentY)

  const scrollDirection = !previousY || previousY < currentY ? "down" : "up"

  const windowSize = useWindowSize()

  const headerOffscreen =
    windowSize.height < 769 &&
    scrollDirection === "down" &&
    currentY > (headerHeight ? headerHeight * 3 : 100)

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
          <div
            css={[
              tw`z-50 fixed left-0 top-0 w-full transition-transform ease-in-out duration-300`,
              headerOffscreen && tw`-translate-y-full`,
            ]}
            ref={headerRef}
          >
            <Header />
          </div>
          {headerHeight ? (
            <div css={[tw`flex-grow`]} style={{ marginTop: headerHeight }}>
              {pageBody}
            </div>
          ) : null}
          <Footer />
        </div>
      </GlobalDataProvider>
    </>
  )
}
