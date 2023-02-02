import Link from "next/link"
import tw, { TwStyle } from "twin.macro"
import { routes } from "^constants/routes"
import { useGlobalDataContext } from "^context/GlobalData"
import { $link } from "^styles/global"

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
  documentLanguageId,
  styles,
}: {
  documentLanguageId: string
  authors: Author[]
  styles: TwStyle
}) => {
  const { isMultipleAuthors } = useGlobalDataContext()

  if (!authors.length) {
    return null
  }

  const validAuthorsForLanguage = filterAuthorsForLanguage(
    authors,
    documentLanguageId
  )

  if (!validAuthorsForLanguage.length) {
    return null
  }

  const authorsProcessed = validAuthorsForLanguage.map((author) => ({
    id: author.id,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    translation: author.translations.find(
      (translation) => translation.languageId === documentLanguageId
    )!,
  }))

  return (
    <div css={[styles]}>
      {authorsProcessed.map((author, i) => (
        <div css={[tw`flex gap-xxxs`]} key={author.id}>
          {isMultipleAuthors ? (
            <Link href={`${routes.contributors}/${author.id}`} passHref>
              <h4 css={[$link]}>{author.translation.name}</h4>
            </Link>
          ) : (
            <h4 css={[$link]}>{author.translation.name}</h4>
          )}
          {i !== authorsProcessed.length - 1 ? "," : ""}
        </div>
      ))}
    </div>
  )
}
