import tw from "twin.macro"

export const $DocumentHeader = tw.div`pb-sm sm:pb-md border-b`

export const $Date = tw.h4`tracking-wide text-sm sm:text-base font-light text-gray-600 font-sans-document mb-xs sm:mb-sm`

export const $Title = tw.h1`text-2xl sm:text-3xl text-gray-900 `

export const $authors = tw`flex gap-xs text-xl sm:text-2xl text-gray-600 mt-xxs sm:mt-sm`

export const $DocumentBody = tw.div`flex flex-col gap-sm mt-sm`

export const $ImageSection = tw.div``

export const $Caption = tw.div`mt-xs border-l-2 border-gray-300 pl-xs text-gray-600 text-sm font-serif-secondary line-height[1.5em]`
