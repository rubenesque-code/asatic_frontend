import { sanitize } from "isomorphic-dompurify"

import { sortEntitiesByDate } from "^helpers/manipulateEntity"

import {
  Author,
  SanitisedArticle,
  SanitisedBlog,
  SanitisedRecordedEvent,
} from "^types/entities"
import { getArticleLikeSummaryText } from "../article-like"
import {
  validateTranslation,
  ValidTranslation as BasicValidatedTranslation,
} from "./validate"
import { validateArticleLikeEntity } from "../article-like/validate"
import { validateRecordedEvent } from "../recorded-event/validate"

/**Used within getStaticProps after validation has occurred in getStaticPaths; remove invalid translations and child entities.*/
export function processAuthorAsParent(
  author: Author,
  {
    validLanguageIds,
    allAuthorsValidChildDocumentEntities,
  }: {
    validLanguageIds: string[]
    allAuthorsValidChildDocumentEntities: {
      articles: SanitisedArticle[]
      blogs: SanitisedBlog[]
      recordedEvents: SanitisedRecordedEvent[]
    }
  }
) {
  const basicValidatedTranslations = author.translations.filter((translation) =>
    validateTranslation(translation, validLanguageIds)
  ) as BasicValidatedTranslation[]

  const authorArticles = allAuthorsValidChildDocumentEntities.articles.filter(
    (article) => author.articlesIds.includes(article.id)
  )
  const authorBlogs = allAuthorsValidChildDocumentEntities.blogs.filter(
    (blog) => author.blogsIds.includes(blog.id)
  )
  const authorRecordedEvents =
    allAuthorsValidChildDocumentEntities.recordedEvents.filter(
      (recordedEvent) => author.recordedEventsIds.includes(recordedEvent.id)
    )

  const processedAuthorTranslations = basicValidatedTranslations.map(
    (authorTranslation) => {
      const entities = {
        articles: processArticleLikeEntitiesForAuthorTranslation(
          authorArticles,
          authorTranslation.languageId
        ),
        blogs: processArticleLikeEntitiesForAuthorTranslation(
          authorBlogs,
          authorTranslation.languageId
        ),
        recordedEvents: processRecordedEventsForAuthorTranslation(
          authorRecordedEvents,
          authorTranslation.languageId
        ),
      }

      const documentsOrdered = sortEntitiesByDate([
        ...entities.articles,
        ...entities.blogs,
        ...entities.recordedEvents,
      ])

      return {
        languageId: authorTranslation.languageId,
        name: authorTranslation.name,
        documents: documentsOrdered,
      }
    }
  )

  return { id: author.id, translations: processedAuthorTranslations }
}

function processArticleLikeEntitiesForAuthorTranslation<
  TEntity extends SanitisedArticle | SanitisedBlog
>(entities: TEntity[], authorTranslationlanguageId: string) {
  return entities
    .filter((entity) =>
      validateArticleLikeEntity(entity, [authorTranslationlanguageId])
    )
    .map((entity) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const translation = entity.translations.find(
        (t) => t.languageId === authorTranslationlanguageId
      )!

      return {
        id: entity.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        title: sanitize(translation.title!),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        text: sanitize(getArticleLikeSummaryText(translation)!),
        publishDate: entity.publishDate,
        type: entity.type,
      }
    })
}

function processRecordedEventsForAuthorTranslation(
  entities: SanitisedRecordedEvent[],
  authorTranslationlanguageId: string
) {
  return entities
    .filter((recordedEvent) =>
      validateRecordedEvent(recordedEvent, [authorTranslationlanguageId])
    )
    .map((entity) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const translation = entity.translations.find(
        (t) => t.languageId === authorTranslationlanguageId
      )!

      return {
        id: entity.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        title: sanitize(translation.title!),
        publishDate: entity.publishDate,
        type: entity.type,
      }
    })
}

export function processAuthorsAsParents(
  authors: Author[],
  {
    validLanguageIds,
    allAuthorsValidChildDocumentEntities,
  }: {
    validLanguageIds: string[]
    allAuthorsValidChildDocumentEntities: {
      articles: SanitisedArticle[]
      blogs: SanitisedBlog[]
      recordedEvents: SanitisedRecordedEvent[]
    }
  }
) {
  return authors.map((author) =>
    processAuthorAsParent(author, {
      validLanguageIds,
      allAuthorsValidChildDocumentEntities,
    })
  )
}

export function processAuthorAsChild(
  author: Author,
  {
    validLanguageIds,
  }: {
    validLanguageIds: string[]
  }
) {
  const translationsProcessed = author.translations
    .filter((translation) => validateTranslation(translation, validLanguageIds))
    .map((translation) => {
      const { name, ...restOfTranslation } = translation

      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        name: sanitize(name! || ""),
        ...restOfTranslation,
      }
    })

  return {
    id: author.id,
    translations: translationsProcessed,
  }
}

export function processAuthorsAsChildren(
  authors: Author[],
  {
    validLanguageIds,
  }: {
    validLanguageIds: string[]
  }
) {
  return authors.map((author) =>
    processAuthorAsChild(author, { validLanguageIds })
  )
}
