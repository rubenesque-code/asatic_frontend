import { GetStaticPaths, GetStaticProps } from "next"
import { filterAndMapEntitiesById } from "^helpers/data"
import { fetchAndValidateArticles } from "^helpers/fetch-and-validate/articles"
import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { fetchAndValidateBlogs } from "^helpers/fetch-and-validate/blogs"
import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"
import { fetchAndValidateRecordedEvents } from "^helpers/fetch-and-validate/recordedEvents"
import { fetchAndValidateRecordedEventTypes } from "^helpers/fetch-and-validate/recordedEventTypes"
import {
  processArticleLikeEntityAsSummary,
  ArticleLikeEntityAsSummary,
} from "^helpers/process-fetched-data/article-like"
import { processAuthor } from "^helpers/process-fetched-data/author/process"
import { getAuthorChildImageIds } from "^helpers/process-fetched-data/author/query"
import {
  getUniqueChildEntitiesIds,
  mapEntityLanguageIds,
} from "^helpers/process-fetched-data/general"
import {
  processRecordedEventAsSummary,
  RecordedEventAsSummary,
} from "^helpers/process-fetched-data/recorded-event/process"
import { getRecordedEventTypeIds } from "^helpers/process-fetched-data/recorded-event/query"
import { fetchAuthor, fetchImages } from "^lib/firebase/firestore"
import { Language, SanitisedSubject } from "^types/entities"

export const getStaticPaths: GetStaticPaths = async () => {
  const authors = await fetchAndValidateAuthors({ ids: "all" })

  if (!authors.entities.length) {
    return {
      paths: [],
      fallback: false,
    }
  }

  const paths = authors.ids.map((id) => ({
    params: {
      id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export type StaticData = {
  author: ReturnType<typeof processAuthor> & {
    languages: Language[]
    articles: ArticleLikeEntityAsSummary[]
    blogs: ArticleLikeEntityAsSummary[]
    recordedEvents: RecordedEventAsSummary[]
  }
  header: {
    subjects: SanitisedSubject[]
  }
}

export const getStaticProps: GetStaticProps<
  StaticData,
  { id: string }
> = async ({ params }) => {
  const globalData = await fetchAndValidateGlobalData()
  const allValidLanguageIds = globalData.languages.ids

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const fetchedAuthor = await fetchAuthor(params!.id)

  const validArticles = await fetchAndValidateArticles({
    ids: fetchedAuthor.articlesIds,
    validLanguageIds: allValidLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: fetchedAuthor.blogsIds,
    validLanguageIds: allValidLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: fetchedAuthor.recordedEventsIds,
    validLanguageIds: allValidLanguageIds,
  })

  const authorIds = getUniqueChildEntitiesIds(
    [
      ...validArticles.entities,
      ...validBlogs.entities,
      ...validRecordedEvents.entities,
    ],
    ["authorsIds"]
  ).authorsIds
  const validAuthors = await fetchAndValidateAuthors({
    ids: authorIds,
    validLanguageIds: allValidLanguageIds,
  })

  const imageIds = getAuthorChildImageIds({
    articles: validArticles.entities,
    blogs: validBlogs.entities,
    recordedEvents: validRecordedEvents.entities,
  })

  const fetchedImages = await fetchImages(imageIds)

  const recordedEventTypeIds = getRecordedEventTypeIds(
    validRecordedEvents.entities
  )
  const validRecordedEventTypes = await fetchAndValidateRecordedEventTypes({
    ids: recordedEventTypeIds,
    validLanguageIds: allValidLanguageIds,
  })

  const processedArticles = validArticles.entities.map((article) =>
    processArticleLikeEntityAsSummary({
      entity: article,
      validAuthors: validAuthors.entities,
      validImages: fetchedImages,
      validLanguageIds: allValidLanguageIds,
    })
  )
  const processedBlogs = validBlogs.entities.map((blog) =>
    processArticleLikeEntityAsSummary({
      entity: blog,
      validAuthors: validAuthors.entities,
      validImages: fetchedImages,
      validLanguageIds: allValidLanguageIds,
    })
  )
  const processedRecordedEvents = validRecordedEvents.entities.map(
    (recordedEvent) =>
      processRecordedEventAsSummary({
        recordedEvent,
        validAuthors: validAuthors.entities,
        validImages: fetchedImages,
        validLanguageIds: allValidLanguageIds,
        validRecordedEventTypes: validRecordedEventTypes.entities,
      })
  )

  const processedAuthor = processAuthor(fetchedAuthor, {
    validLanguageIds: allValidLanguageIds,
  })

  const pageData: StaticData = {
    author: {
      ...processedAuthor,
      languages: filterAndMapEntitiesById(
        mapEntityLanguageIds(processedAuthor),
        globalData.languages.entities
      ),
      articles: processedArticles,
      blogs: processedBlogs,
      recordedEvents: processedRecordedEvents,
    },
    header: {
      subjects: globalData.subjects.entities,
    },
  }

  return {
    props: pageData,
  }
}
