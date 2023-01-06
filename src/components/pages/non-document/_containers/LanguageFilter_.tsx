import tw from "twin.macro"
import { TranslateIcon } from "^components/Icons"
import { Language } from "^types/entities"

export type LanguageFilter_Props = {
  currentFilterLanguageId: FilterLanguageId
  setFilterLanguageId: (languageId: FilterLanguageId) => void
  filterLanguages: Language[]
}

export type FilterLanguageId = "all" | Omit<string, "all">

export const LanguageFilter_ = ({
  currentFilterLanguageId,
  setFilterLanguageId,
  filterLanguages,
}: LanguageFilter_Props) => {
  return (
    <div css={[tw`flex items-center gap-sm`]}>
      <div css={[tw`text-gray-400`]}>
        <TranslateIcon weight="light" />
      </div>
      <div css={[tw`flex gap-xs items-center`]}>
        <div
          css={[
            tw`py-0.5 px-2 border rounded-md text-sm font-serif-secondary tracking-wide text-gray-700 transition-colors ease-in-out`,
            currentFilterLanguageId !== "all" &&
              tw`text-gray-400 cursor-pointer border-gray-100`,
          ]}
          onClick={() => {
            if (currentFilterLanguageId === "all") {
              return
            }
            setFilterLanguageId("all")
          }}
        >
          All
        </div>
        {filterLanguages.map((language) => (
          <div
            css={[
              tw`py-0.5 px-2 border rounded-md text-sm font-serif-secondary tracking-wide text-gray-700 transition-colors ease-in-out`,
              language.id !== currentFilterLanguageId &&
                tw`text-gray-400 cursor-pointer border-gray-100`,
            ]}
            onClick={() => {
              if (language.id === currentFilterLanguageId) {
                return
              }
              setFilterLanguageId(language.id)
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
