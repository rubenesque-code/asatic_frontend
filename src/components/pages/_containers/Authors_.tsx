/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Link from "next/link"
import tw, { TwStyle } from "twin.macro"
import { routes } from "^constants/routes"
import { useGlobalDataContext } from "^context/GlobalData"
import { $link } from "^styles/global"

import { Author as AuthorType } from "^types/entities"

function filterAuthorsForLanguage(authors: AuthorType[], languageId: string) {
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
  authors: AuthorType[]
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
          <Author authorId={author.id} authorName={author.translation.name!} />
          {i !== authorsProcessed.length - 1 ? "," : ""}
        </div>
      ))}
    </div>
  )
}

const Author = ({
  authorId,
  authorName,
}: {
  authorId: string
  authorName: string
}) => {
  const { isMultipleAuthors } = useGlobalDataContext()

  return isMultipleAuthors ? (
    <Link href={`${routes.contributors}/${authorId}`} passHref>
      <$Author css={[$link]}>{authorName}</$Author>
    </Link>
  ) : (
    <$Author>{authorName}</$Author>
  )
}

const $Author = tw.h4``
// tw.h4`cursor-pointer hover:text-blue-900 transition-colors ease-in-out`
