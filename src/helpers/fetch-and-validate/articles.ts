import { fetchArticles } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { filterValidArticleLikeEntities } from "^helpers/process-fetched-data/article-like"

export async function fetchAndValidateArticles({
  ids,
  validLanguageIds: passedValidLanguageIds,
}: {
  ids: string[] | "all"
  validLanguageIds?: string[]
}) {
  const fetched = await fetchArticles(ids)

  if (!fetched.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validLanguageIds = passedValidLanguageIds
    ? passedValidLanguageIds
    : (await fetchAndValidateLanguages("all")).ids

  const validArticles = filterValidArticleLikeEntities(
    fetched,
    validLanguageIds
  )

  return {
    entities: validArticles,
    ids: mapIds(validArticles),
  }
}
