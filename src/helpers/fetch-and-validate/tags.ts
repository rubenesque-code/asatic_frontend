import { fetchTags } from "^lib/firebase/firestore"

import { mapIds } from "^helpers/data"
import { filterValidTags } from "^helpers/process-fetched-data/tag/validate"

export async function fetchAndValidateTags({ ids }: { ids: string[] | "all" }) {
  const fetchedTags = await fetchTags(ids)

  if (!fetchedTags.length) {
    return {
      entities: [],
      ids: [],
    }
  }

  const validTags = filterValidTags(fetchedTags)

  return {
    entities: validTags,
    ids: mapIds(validTags),
  }
}
