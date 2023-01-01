import tw from "twin.macro"

export const $DocumentHeader = tw.div`pb-md border-b`

export const $Date = tw.h4`tracking-wide font-light text-gray-600 font-sans-document mb-xs`

export const $Title = tw.h1`text-3xl text-gray-900 line-height[1.5em]`

export const $authors = tw`flex gap-xs text-2xl text-gray-600 mt-xs line-height[1.5em] `

export const $DocumentBody = tw.div`flex flex-col gap-sm mt-sm`

export const $TextSection = tw.div`flex flex-col gap-sm prose prose-lg`

export const $ImageSection = tw.div``

export const $Caption = tw.div`mt-xs border-l-2 border-gray-300 pl-xs text-gray-600 text-sm font-serif-secondary line-height[1.5em]`
