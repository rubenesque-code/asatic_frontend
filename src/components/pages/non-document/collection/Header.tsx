import tw from "twin.macro"
import { SummaryText } from "^components/pages/_collections/DocumentSummary"

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
  ...languages_props
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
      <div css={[tw`relative pb-sm border-b h-[600px]`]}>
        <div css={[tw`absolute left-0 top-0 w-full h-full`]}>
          <StorageImage
            image={bannerImage.storageImage}
            vertPosition={bannerImage.vertPosition}
          />
        </div>
        <div
          css={[
            tw`absolute left-xl top-1/2 -translate-y-1/2 z-10 max-w-[500px] p-xl bg-white bg-opacity-80`,
          ]}
        >
          <h3
            css={[
              tw`uppercase font-sans-document text-sm tracking-wider mb-sm text-gray-600`,
            ]}
          >
            {siteTranslations.collection[siteLanguage.id]}
          </h3>
          <h2 css={[tw`text-4xl text-gray-800 tracking-wide`]}>
            {translation.title}
          </h2>
          <div css={[tw`mt-md`]}>
            <SummaryText
              htmlStr={translation.description}
              languageId={translation.languageId}
              maxCharacters={300}
            />
          </div>
        </div>

        {/*       <div css={[tw`mt-lg pl-sm md:pl-md`]}>
        <Languages_ {...languages_props} />
      </div> */}
      </div>
    </$CenterMaxWidth_>
  )
}

export default DocumentHeader
