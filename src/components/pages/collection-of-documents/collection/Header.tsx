import tw from "twin.macro"
// import { SummaryText } from "^components/pages/_collections/DocumentSummary"

import { Languages_, Languages_Props } from "^components/pages/_containers"
import StorageImage from "^components/StorageImage"
import { StaticData } from "./staticData"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { siteTranslations } from "^constants/siteTranslations"
import { Language } from "^types/entities"
import { useSiteLanguageContext } from "^context/SiteLanguage"

const DocumentHeader = ({
  bannerImage,
  translations,
  documentLanguage,
  documentLanguages,
}: {
  translations: StaticData["collection"]["translations"]
  bannerImage: StaticData["collection"]["bannerImage"]
  documentLanguage: Language
} & Languages_Props) => {
  const { siteLanguage } = useSiteLanguageContext()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const translation = translations.find(
    (translation) => translation.languageId === documentLanguage.id
  )!

  return (
    <$CenterMaxWidth_ maxWidth={tw`max-w-[1400px]`}>
      <div>
        <div
          css={[
            tw`relative pb-sm border-b h-[300px] sm:h-[500px] md:h-[600px]`,
          ]}
        >
          <div css={[tw`absolute left-0 top-0 w-full h-full`]}>
            <StorageImage
              image={bannerImage.storageImage}
              vertPosition={bannerImage.vertPosition}
            />
          </div>
          <div
            css={[
              tw`absolute inset-lg hidden sm:block sm:inset-auto sm:left-xl sm:translate-x-0 sm:top-1/2 sm:-translate-y-1/2 z-10 max-w-[500px] p-lg bg-white bg-opacity-80`,
            ]}
          >
            {documentLanguages.length > 1 ? (
              <div css={[tw`mb-md`]}>
                <Languages_
                  documentLanguage={documentLanguage}
                  documentLanguages={documentLanguages}
                  color="dark"
                />
              </div>
            ) : null}
            <h3
              css={[
                tw`uppercase font-sans-document text-sm tracking-wider mb-sm text-gray-600`,
              ]}
            >
              {siteTranslations.collection[siteLanguage.id]}
            </h3>
            <h2 css={[tw`text-5xl text-gray-800 tracking-wide`]}>
              {translation.title}
            </h2>
            <div css={[tw`mt-md`]}>{translation.description}</div>
          </div>
        </div>
      </div>
    </$CenterMaxWidth_>
  )
}

export default DocumentHeader
