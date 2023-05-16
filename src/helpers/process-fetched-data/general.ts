import { removeArrDuplicates } from "^helpers/general"
import { mapLanguageIds } from "../data"

export function mapEntitiesLanguageIds<
  TTranslation extends { languageId: string },
  TEntity extends { translations: TTranslation[] }
>(entities: TEntity[]) {
  return entities.flatMap((e) => mapLanguageIds(e.translations))
}

export function mapEntityLanguageIds<
  TTranslation extends { languageId: string },
  TEntity extends { translations: TTranslation[] }
>(entity: TEntity) {
  return mapLanguageIds(entity.translations)
}

export function getUniqueChildEntitiesIds<
  TParent extends { [k in TKey]: TArr },
  TKey extends keyof TParent,
  TArr extends string[]
>(parents: TParent[], keys: TKey[]) {
  const ids = keys.map((key) => {
    const ids = parents.flatMap((parent) => parent[key])
    const uniqueIds = removeArrDuplicates(ids)

    return [key, uniqueIds]
  })

  return Object.fromEntries(ids) as { [k in TKey]: TArr }
}
