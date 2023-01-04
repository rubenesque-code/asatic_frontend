import { fetchBlogs } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { filterValidArticleLikeEntities } from "^helpers/process-fetched-data/article-like"

export async function fetchAndValidateBlogs({
  ids,
  validLanguageIds: passedValidLanguageIds,
}: {
  ids: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetchedBlogs = await fetchBlogs(ids)

  if (!fetchedBlogs.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages("all")).ids

  const validBlogs = filterValidArticleLikeEntities(
    fetchedBlogs,
    validLanguageIds
  )

  return {
    entities: validBlogs,
    ids: mapIds(validBlogs),
  }
}
