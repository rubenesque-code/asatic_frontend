import tw from "twin.macro"
import { SortAscendingIcon, TranslateIcon } from "^components/Icons"
import { Language } from "^types/entities"

export type LanguageSort_Props = {
  currentSortLanguageId: string
  setSortLanguageId: (languageId: string) => void
  entitiesLanguages: Language[]
}

export const LanguageSort_ = ({
  currentSortLanguageId,
  setSortLanguageId,
  entitiesLanguages,
}: LanguageSort_Props) => {
  return (
    <div css={[tw`flex items-center gap-sm`]}>
      <div css={[tw`text-gray-400 flex items-center gap-sm`]}>
        <span css={[tw`text-xl text-gray-600`]}>
          <SortAscendingIcon weight="light" />
        </span>
        <TranslateIcon weight="light" />
      </div>
      <div css={[tw`flex gap-xs items-center`]}>
        {entitiesLanguages.map((language) => (
          <div
            css={[
              tw`py-0.5 px-2 border rounded-md text-sm font-serif-secondary tracking-wide text-gray-700 transition-colors ease-in-out`,
              language.id !== currentSortLanguageId &&
                tw`text-gray-400 cursor-pointer border-gray-100`,
            ]}
            onClick={() => {
              if (language.id === currentSortLanguageId) {
                return
              }
              setSortLanguageId(language.id)
            }}
            key={language.id}
          >
            {language.name}
          </div>
        ))}
      </div>
    </div>
  )
}
