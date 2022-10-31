import { TwStyle } from 'twin.macro'

import { Author } from '^types/author'
import { Language } from '^types/language'

export const Authors_ = ({
  authors,
  selectedLanguage,
  styles,
}: {
  selectedLanguage: Language
  authors: Author[]
  styles: TwStyle
}) => {
  if (!authors.length) {
    return null
  }

  const authorsForSelectedLanguage = authors
    .map((author) =>
      author.translations.find((t) => t.languageId === selectedLanguage.id)
    )
    .flatMap((authorTranslation) =>
      authorTranslation?.name ? [authorTranslation] : []
    )

  if (!authorsForSelectedLanguage.length) {
    return null
  }

  return (
    <div css={[styles]}>
      {authorsForSelectedLanguage.map((authorTranslation, i) => (
        <h4 key={authorTranslation.id}>
          {authorTranslation.name}
          {i !== authorsForSelectedLanguage.length - 1 ? ',' : ''}
        </h4>
      ))}
    </div>
  )
}
