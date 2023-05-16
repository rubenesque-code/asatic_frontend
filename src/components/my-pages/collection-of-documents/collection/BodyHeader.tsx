import tw from "twin.macro"

import { StaticData } from "./staticData"

import { siteTranslations } from "^constants/siteTranslations"
import { SiteLanguageId } from "^constants/languages"

import StorageImage from "^components/StorageImage"
import { $CenterMaxWidth_ } from "^components/my-pages/_presentation"
import { $ContentSectionMaxWidthWrapper } from "^components/my-pages/_presentation"

const BodyHeader = ({
  collection,
}: {
  collection: StaticData["pageData"]["collection"]
}) => {
  const metaProps: MetaProps = {
    description: collection.description,
    languageId: collection.languageId,
    title: collection.title,
  }

  return (
    <$CenterMaxWidth_ maxWidth={tw`max-w-[3500px]`} styles={tw`border-b`}>
      <div>
        <div css={[tw`relative pb-sm h-[300px] sm:h-[500px] md:h-[600px]`]}>
          <div css={[tw`absolute left-0 top-0 w-full h-full`]}>
            <StorageImage
              image={collection.bannerImage.storageImage}
              vertPosition={collection.bannerImage.vertPosition}
            />
          </div>
          <MetaContentLarge {...metaProps} />
        </div>
        <MetaContentSmall {...metaProps} />
      </div>
    </$CenterMaxWidth_>
  )
}

export default BodyHeader

type MetaProps = {
  languageId: SiteLanguageId
  title: string
  description?: string
}

const MetaContentLarge = ({ title, description, languageId }: MetaProps) => {
  return (
    <div css={[tw`absolute left-0 w-full top-1/2 -translate-y-1/2`]}>
      <$ContentSectionMaxWidthWrapper styles={tw`pl-md md:pl-lg`}>
        <div
          css={[
            tw` hidden sm:block z-10 max-w-[500px] p-lg bg-white bg-opacity-80`,
          ]}
        >
          <$SubHeading css={[tw`mb-sm`]}>
            {siteTranslations.collection[languageId]}
          </$SubHeading>
          <$Title css={[tw`text-3xl`]}>{title}</$Title>
          <div css={[tw`mt-md`]}>
            <$Description text={description} />
          </div>
        </div>
      </$ContentSectionMaxWidthWrapper>
    </div>
  )
}

const MetaContentSmall = ({ title, description, languageId }: MetaProps) => {
  return (
    <div css={[tw`sm:hidden border-t border-b px-sm pt-sm pb-md mb-sm`]}>
      <$SubHeading css={[tw`mb-xs`]}>
        {siteTranslations["collection"][languageId]}
      </$SubHeading>
      <$Title css={[tw`text-3xl`]}>{title}</$Title>
      <div css={[tw`mt-sm`]}>
        <$Description text={description} />
      </div>
    </div>
  )
}

const $SubHeading = tw.h3`uppercase font-sans-document text-sm tracking-wider text-gray-600`

const $Title = tw.h2`text-gray-800 tracking-wide`

const $Description = ({ text }: { text?: string }) =>
  !text ? null : (
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
