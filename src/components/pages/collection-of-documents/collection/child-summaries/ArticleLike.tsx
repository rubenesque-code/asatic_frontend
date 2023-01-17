import tw from "twin.macro"

import { determineChildTranslation } from "^helpers/document"
import { ArticleLikeEntityAsSummary } from "^helpers/process-fetched-data/article-like"

import { Authors_ } from "^components/pages/_containers"
import {
  SummaryImage,
  SummaryText,
} from "^components/pages/_collections/DocumentSummary"
import Link from "next/link"
import { routes } from "^constants/routes"
import { useRouter } from "next/router"
import { $link } from "^styles/global"

const $authors = tw`flex gap-xs text-lg text-gray-600 mb-xxs`

const ArticleLikeEntity = ({
  articleLikeEntity,
  parentCurrentLanguageId,
}: {
  articleLikeEntity: ArticleLikeEntityAsSummary
  parentCurrentLanguageId: string
}) => {
  const translation = determineChildTranslation(
    articleLikeEntity.translations,
    parentCurrentLanguageId
  )

  const maxBodyCharacters = articleLikeEntity.summaryImage ? 120 : 300

  const router = useRouter()

  const routeRoot =
    articleLikeEntity.type === "article" ? routes.articles : routes.blogs
  const pathname = `${routeRoot}/${articleLikeEntity.id}`

  return (
    <div css={[tw`w-full sm:flex sm:gap-sm`]}>
      {articleLikeEntity.summaryImage ? (
        <div css={[tw`sm:h-[200px] aspect-ratio[16/9]`]}>
          <SummaryImage
            image={articleLikeEntity.summaryImage}
            styles={tw`mb-xs`}
          />
        </div>
      ) : null}
      <div css={[tw``]}>
        <Link
          href={{
            pathname,
            query: {
              ...router.query,
              documentLanguageId: translation.languageId,
            },
          }}
          passHref
        >
          <h3 css={[tw`text-xl mb-xxs cursor-pointer`, $link]}>
            {translation.title}
          </h3>
        </Link>
        <Authors_
          authors={articleLikeEntity.authors}
          parentLanguageId={translation.languageId}
          styles={$authors}
        />
        <p
          css={[
            tw`mb-xs text-gray-800 font-sans-document font-light text-sm tracking-wider`,
          ]}
        >
          {articleLikeEntity.publishDate}
        </p>
        <SummaryText
          htmlStr={translation.summaryText}
          languageId={translation.languageId}
          maxCharacters={maxBodyCharacters}
          // maxCharacters={1000}
          // overflowHidden={fa}
        />
      </div>
    </div>
  )
}

export default ArticleLikeEntity
