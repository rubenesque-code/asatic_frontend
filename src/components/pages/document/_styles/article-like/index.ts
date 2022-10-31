import tw from 'twin.macro'

export const $Header = tw.div`pb-md border-b`

export const $Date = tw.h4`tracking-wide font-light text-gray-600 font-date mb-xs`

export const $Title = tw.h1`text-3xl text-gray-900 font-documentTitle`

export const $authors = tw`flex gap-xs text-2xl text-gray-700 font-documentTitle mt-xs`

export const $Body = tw.div`flex flex-col gap-sm`

export const $TextSection = tw.div`font-documentTitle prose prose-lg `

export const $ImageSection = tw.div``

export const $Caption = tw.div`mt-xs border-l-2 border-gray-300 pl-xs text-gray-600 text-sm font-documentTitle`
