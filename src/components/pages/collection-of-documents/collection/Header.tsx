import tw from "twin.macro"
// import { SummaryText } from "^components/pages/_collections/DocumentSummary"

import { Languages_, Languages_Props } from "^components/pages/_containers"
import StorageImage from "^components/StorageImage"
import { StaticData } from "./staticData"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { siteTranslations } from "^constants/siteTranslations"
import { Language } from "^types/entities"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { ReactElement } from "react"
import { MyOmit } from "^types/utilities"

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

  const metaProps: MyOmit<MetaProps, "languages"> = {
    description: translation.description,
    siteLanguageId: siteLanguage.id,
    title: translation.title,
  }

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
          <MetaContentLarge
            {...metaProps}
            languages={
              <Languages
                documentLanguage={documentLanguage}
                documentLanguages={documentLanguages}
                color="dark"
              />
            }
          />
        </div>
        <MetaContentSmall
          {...metaProps}
          languages={
            <Languages
              documentLanguage={documentLanguage}
              documentLanguages={documentLanguages}
            />
          }
        />
      </div>
    </$CenterMaxWidth_>
  )
}

export default DocumentHeader

type MetaProps = {
  siteLanguageId: "english" | "tamil"
  languages: ReactElement
  title: string
  description: string
}

const MetaContentLarge = ({
  languages,
  title,
  description,
  siteLanguageId,
}: MetaProps) => {
  return (
    <div
      css={[
        tw`absolute inset-lg hidden sm:block sm:inset-auto sm:left-xl sm:translate-x-0 sm:top-1/2 sm:-translate-y-1/2 z-10 max-w-[500px] p-lg bg-white bg-opacity-80`,
      ]}
    >
      {languages}
      <$SubHeading css={[tw`mb-sm`]}>
        {siteTranslations["collection"][siteLanguageId]}
      </$SubHeading>
      <$Title css={[tw`text-5xl`]}>{title}</$Title>
      <div css={[tw`mt-md`]}>
        <$Description text={description} />
      </div>
    </div>
  )
}

const MetaContentSmall = ({
  languages,
  title,
  description,
  siteLanguageId,
}: MetaProps) => {
  return (
    <div css={[tw`sm:hidden border-t border-b px-sm pt-sm pb-md`]}>
      {languages}
      <$SubHeading css={[tw`mb-xs`]}>
        {siteTranslations["collection"][siteLanguageId]}
      </$SubHeading>
      <$Title css={[tw`text-4xl`]}>{title}</$Title>
      <div css={[tw`mt-sm`]}>
        <$Description text={description} />
      </div>
    </div>
  )
}

const $SubHeading = tw.h3`uppercase font-sans-document text-sm tracking-wider text-gray-600`

const $Title = tw.h2`text-gray-800 tracking-wide`

const $Description = ({ text }: { text: string }) => (
  <div
    css={[tw`prose`]}
    className="custom-prose"
    style={{
      width: "auto",
      maxWidth: "100%",
    }}
  >
    {text}
  </div>
)

const Languages = (props: Languages_Props) => {
  if (!props.documentLanguages.length) {
    return null
  }
  return (
    <div css={[tw`mb-md`]}>
      <Languages_ {...props} />
    </div>
  )
}
