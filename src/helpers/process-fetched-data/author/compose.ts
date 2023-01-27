import { fetchAndValidateAuthors } from "^helpers/fetch-and-validate/authors"
import { Author } from "^types/entities"
import { getUniqueChildEntitiesIds } from "../general"
import { processAuthorsAsChildren } from "./process"

export async function handleProcessAuthorsAsChildren<
  TEntity extends { authorsIds: string[] }
>(
  entities: TEntity[],
  {
    validLanguageIds,
    allValidAuthors,
  }: { validLanguageIds: string[]; allValidAuthors?: Author[] }
) {
  const ids = getUniqueChildEntitiesIds(entities, ["authorsIds"]).authorsIds

  if (!ids.length) {
    return []
  }

  const validated = allValidAuthors
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ids.map((id) => allValidAuthors.find((a) => a.id === id)!)
    : (
        await fetchAndValidateAuthors({
          ids: ids,
          validLanguageIds,
        })
      ).entities

  const processed = processAuthorsAsChildren(validated, {
    validLanguageIds,
  })

  return processed
}
