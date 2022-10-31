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
  if (!documentLanguages.length) {
    return null
  }

  return (
    <div css={[tw`flex items-center gap-sm mb-md`]}>
      <div css={[tw`text-gray-400`]}>
        <TranslateIcon />
      </div>
      <div css={[tw`flex gap-sm items-center`]}>
        {documentLanguages.map((language) => (
          <div
            css={[
              tw`py-0.5 px-2 border rounded-md text-sm font-documentTitle tracking-wide text-gray-500`,
              language.id === selectedLanguage.id && tw`text-gray-700`,
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
