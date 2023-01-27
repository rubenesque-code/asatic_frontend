import tw, { styled } from "twin.macro"
import { SiteLanguageId } from "^constants/languages"

export const $SectionContent = tw.div`border-l border-r`

export const $SectionHeaderContainer = tw.div`flex justify-between  px-xl pb-sm pt-md`
export const $SectionHeaderTitle = tw.div`text-2xl capitalize text-gray-700`
export const $SectionHeaderSeeAllContainer = tw.div`flex items-center gap-xs text-gray-600`
export const $SectionHeaderSeeAllText = styled.div(
  ({ languageId }: { languageId: SiteLanguageId }) => [
    tw`font-light capitalize`,
    languageId === "tamil"
      ? tw`font-sans-primary-tamil`
      : tw`font-sans-primary`,
  ]
)

export const $SectionHeaderSeeAllArrowIcon = tw.span`translate-y-0.5 text-lg`
