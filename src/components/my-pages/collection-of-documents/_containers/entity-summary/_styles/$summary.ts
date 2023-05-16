import tw, { styled } from "twin.macro"

import { $link } from "^styles/global"

export const $SummaryContainer = tw.div`p-sm`

export const $Title = styled(tw.h3`text-xl mb-xxs`)(() => [$link])

export const $authors = tw`flex gap-xs text-lg text-gray-600 mb-xxs`

export const $Date = styled.p(({ languageId }: { languageId: string }) => [
  languageId === "tamil"
    ? tw`font-sans-document-tamil`
    : tw`font-sans-document`,
  tw`mb-xs text-gray-800 font-light text-sm tracking-wider`,
])
// export const $Date = tw.p`mb-xs text-gray-800 font-light text-sm tracking-wider`

export const $image = tw`mb-xs`
