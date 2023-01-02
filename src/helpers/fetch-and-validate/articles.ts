import { fetchArticles } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { fetchAndValidateLanguages } from "./languages"
import { filterValidArticleLikeEntities } from "^helpers/process-fetched-data/article-like"

export async function fetchAndValidateArticles() {
  const fetched = await fetchArticles()

  if (!fetched.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const languages = await fetchAndValidateLanguages()

  const validArticles = filterValidArticleLikeEntities(fetched, languages.ids)

  return {
    entities: validArticles,
    ids: mapIds(validArticles),
  }
}
