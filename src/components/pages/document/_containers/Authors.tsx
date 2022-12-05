import { TwStyle } from "twin.macro"
import { findTranslation } from "^helpers/data"

import { Author, Language } from "^types/entities"

export const Authors_ = ({
  authors,
  documentLanguage,
  styles,
}: {
  documentLanguage: Language
  authors: Author[]
  styles: TwStyle
}) => {
  if (!authors.length) {
    return null
  }

  const authorsForSelectedLanguage = authors
    .map((author) => findTranslation(author.translations, documentLanguage.id))
    .flatMap((authorTranslation) =>
      authorTranslation?.name?.length ? [authorTranslation] : []
    )

  if (!authorsForSelectedLanguage.length) {
    return null
  }

  return (
    <div css={[styles]}>
      {authorsForSelectedLanguage.map((authorTranslation, i) => (
        <h4 key={authorTranslation.id}>
          {authorTranslation.name}
          {i !== authorsForSelectedLanguage.length - 1 ? "," : ""}
        </h4>
      ))}
    </div>
  )
}
