import { mapLanguageIds } from "^helpers/data"
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
        articles: authorArticles
          .filter((article) =>
            mapLanguageIds(article.translations).includes(
              authorTranslation.languageId
            )
          )
          .map((article) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const translation = article.translations.find(
              (t) => t.languageId === authorTranslation.languageId
            )!

            return {
              id: article.id,
              title: translation.id,
              text: getArticleLikeSummaryText(translation),
              publishDate: article.publishDate,
              type: "article",
            }
          }),
        blogs: authorBlogs
          .filter((blog) =>
            mapLanguageIds(blog.translations).includes(
              authorTranslation.languageId
            )
          )
          .map((blog) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const translation = blog.translations.find(
              (t) => t.languageId === authorTranslation.languageId
            )!

            return {
              id: blog.id,
              title: translation.id,
              text: getArticleLikeSummaryText(translation),
              publishDate: blog.publishDate,
              type: "blog",
            }
          }),
        recordedEvents: authorRecordedEvents
          .filter((recordedEvent) =>
            mapLanguageIds(recordedEvent.translations).includes(
              authorTranslation.languageId
            )
          )
          .map((recordedEvent) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const translation = recordedEvent.translations.find(
              (t) => t.languageId === authorTranslation.languageId
            )!

            return {
              id: recordedEvent.id,
              title: translation.id,
              publishDate: recordedEvent.publishDate,
              type: "recordedEvent",
            }
          }),
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
  const validTranslations = author.translations.filter((translation) =>
    validateTranslation(translation, validLanguageIds)
  ) as BasicValidatedTranslation[]

  return {
    id: author.id,
    translations: validTranslations,
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
