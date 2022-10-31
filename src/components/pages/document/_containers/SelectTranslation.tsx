import tw from 'twin.macro'

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
    <div css={[tw`flex gap-sm items-center mb-sm`]}>
      {documentLanguages.map((language) => (
        <div
          css={[
            tw`py-0.5 px-2 border rounded-md text-sm`,
            language.id === selectedLanguage.id && tw`bg-gray-100`,
          ]}
          onClick={() => setSelectedLanguage(language)}
          key={language.id}
        >
          {language.name}
        </div>
      ))}
    </div>
  )
}
