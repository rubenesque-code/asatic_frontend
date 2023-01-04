import Link from "next/link"
import React from "react"
import tw, { TwStyle } from "twin.macro"
import { routes } from "^constants/routes"

import { Author } from "^types/entities"

function filterAuthorsForLanguage(authors: Author[], languageId: string) {
  return authors.filter((author) =>
    author.translations.find(
      (translation) =>
        translation.languageId === languageId && translation.name?.length
    )
  )
}

export const Authors_ = ({
  authors,
  parentLanguageId,
  styles,
}: {
  parentLanguageId: string
  authors: Author[]
  styles: TwStyle
}) => {
  if (!authors.length) {
    return null
  }

  const validAuthorsForLanguage = filterAuthorsForLanguage(
    authors,
    parentLanguageId
  )

  if (!validAuthorsForLanguage.length) {
    return null
  }

  const authorsProcessed = validAuthorsForLanguage.map((author) => ({
    id: author.id,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    translation: author.translations.find(
      (translation) => translation.languageId === parentLanguageId
    )!,
  }))

  return (
    <div css={[styles]}>
      {authorsProcessed.map((author, i) => (
        <div css={[tw`flex gap-xxxs`]} key={author.id}>
          <Link
            href={`${routes.contributors}/${author.translation.id}`}
            passHref
          >
            <h4
              css={[
                tw`cursor-pointer hover:text-blue-900 transition-colors ease-in-out`,
              ]}
            >
              {author.translation.name}
            </h4>
          </Link>
          {i !== authorsProcessed.length - 1 ? "," : ""}
        </div>
      ))}
    </div>
  )
}
