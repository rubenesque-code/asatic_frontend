import tw from 'twin.macro'
import { TranslateIcon } from '^components/Icons'

import { Language } from '^types/language'

export const SelectTranslation = ({
  documentLanguages,
  selectedLanguage,
  setSelectedLanguage,
}: {
  documentLanguages: Language[]
  selectedLanguage: Language
  setSelectedLanguage: (language: Language) => void
}) => {
  if (!documentLanguages.length || documentLanguages.length < 2) {
    return null
  }

  return (
    <div css={[tw`flex items-center gap-sm mb-md`]}>
      <div css={[tw`text-gray-400`]}>
        <TranslateIcon weight="light" />
      </div>
      <div css={[tw`flex gap-xs items-center`]}>
        {documentLanguages.map((language) => (
          <div
            css={[
              tw`py-0.5 px-2 border rounded-md text-sm font-serif-body tracking-wide text-gray-700 transition-colors ease-in-out`,
              language.id !== selectedLanguage.id &&
                tw`text-gray-400 cursor-pointer border-gray-100`,
            ]}
            onClick={() => setSelectedLanguage(language)}
            key={language.id}
          >
            {language.name}
          </div>
        ))}
      </div>
    </div>
  )
}
