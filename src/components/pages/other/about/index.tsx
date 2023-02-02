import { useSiteLanguageContext } from "^context/SiteLanguage"
import { StaticData } from "./staticData"

import { siteTranslations } from "^constants/siteTranslations"

import { BodyFontWrapper, PageWrapper_ } from "^components/pages/_containers"
import Prose_ from "^components/pages/document/_containers/Prose_"
import { $DocumentMaxWidthContainer } from "^components/pages/document/_presentation"
import tw from "twin.macro"

const AboutPageContent = ({ globalData, pageData }: StaticData) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <PageWrapper_
      globalData={globalData}
      pageTitle={siteTranslations.about[siteLanguage.id]}
    >
      <PageBody pageData={pageData} />
    </PageWrapper_>
  )
}

export default AboutPageContent

const PageBody = ({
  pageData: { aboutPage },
}: {
  pageData: StaticData["pageData"]
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = aboutPage.translations.find(
    (translation) => translation.languageId === siteLanguage.id
  )!

  return (
    <BodyFontWrapper documentLanguageId={translation.languageId}>
      <$DocumentMaxWidthContainer>
        <div css={[tw`mt-xl px-sm`]}>
          <h1 css={[tw`text-3xl text-gray-700 capitalize mb-lg`]}>
            {siteTranslations.about[siteLanguage.id]}{" "}
            {siteTranslations.siteName[siteLanguage.id]}
          </h1>
          <Prose_ htmlStr={translation.text} />
        </div>
      </$DocumentMaxWidthContainer>
    </BodyFontWrapper>
  )
}
