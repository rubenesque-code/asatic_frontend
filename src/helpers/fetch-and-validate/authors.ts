import { fetchAuthors } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import {
  filterValidAuthorsAsChildren,
  filterValidAuthorsAsParents,
} from "^helpers/process-fetched-data/author/validate"
import { getUniqueChildEntitiesIds } from "^helpers/process-fetched-data/general"
import { fetchAndValidateArticles } from "./articles"
import { fetchAndValidateBlogs } from "./blogs"
import { fetchAndValidateRecordedEvents } from "./recordedEvents"

export async function fetchAndValidateAuthors({
  authorRelation = "default",
  ids,
  validLanguageIds: passedValidLanguageIds,
}: {
  authorRelation?: "child-of-document" | "default"
  ids: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetchedAuthors = await fetchAuthors(ids)

  if (!fetchedAuthors.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages("all")).ids

  if (authorRelation === "child-of-document") {
    const validAuthors = filterValidAuthorsAsChildren(
      fetchedAuthors,
      validLanguageIds
    )

    return {
      entities: validAuthors,
      ids: mapIds(validAuthors),
    }
  }

  const childIds = getUniqueChildEntitiesIds(fetchedAuthors, [
    "articlesIds",
    "blogsIds",
    "recordedEventsIds",
  ])

  const validArticles = await fetchAndValidateArticles({
    ids: childIds.articlesIds,
    validLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: childIds.blogsIds,
    validLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: childIds.blogsIds,
    validLanguageIds,
  })

  const validAuthors = filterValidAuthorsAsParents(fetchedAuthors, {
    validDocumentEntityIds: {
      articles: validArticles.ids,
      blogs: validBlogs.ids,
      recordedEvents: validRecordedEvents.ids,
    },
    validLanguageIds,
  })

  return {
    entities: validAuthors,
    ids: mapIds(validAuthors),
  }
}
