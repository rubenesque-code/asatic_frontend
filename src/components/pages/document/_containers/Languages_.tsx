import tw from "twin.macro"
import { TranslateIcon } from "^components/Icons"

import { Language } from "^types/entities"

export const Languages_ = ({
  documentLanguages,
  documentLanguage,
  setDocumentLanguage,
}: {
  documentLanguages: Language[]
  documentLanguage: Language
  setDocumentLanguage: (language: Language) => void
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
              language.id !== documentLanguage.id &&
                tw`text-gray-400 cursor-pointer border-gray-100`,
            ]}
            onClick={() => setDocumentLanguage(language)}
            key={language.id}
          >
            {language.name}
          </div>
        ))}
      </div>
    </div>
  )
}
