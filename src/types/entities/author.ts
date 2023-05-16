import {
  EntityGlobalFields,
  EntityNameToChildKeyTuple,
  EntityNameTupleSubset,
  RelatedDisplayEntityFields,
} from "./entity"
import { EntityAsChildStatus } from "./entity-status"
import { TranslationField, Translations } from "./entity-translation"
import { TupleToUnion } from "./utilities"

export type Author = EntityGlobalFields<"author"> &
  Translations<AuthorTranslationFields> &
  AuthorRelatedEntityFields

export type AuthorRelatedEntityFields =
  RelatedDisplayEntityFields<AuthorRelatedEntity>

export type AuthorRelatedEntityTuple = EntityNameTupleSubset<
  "article" | "blog" | "recordedEvent"
>

export type AuthorRelatedEntity = TupleToUnion<AuthorRelatedEntityTuple>

type AuthorTranslationFields = TranslationField<"name">

export type AuthorTranslation = Author["translations"][number]

export type ChildAuthorMissingRequirement = "no valid translation"

export type AuthorAsChildStatus =
  EntityAsChildStatus<ChildAuthorMissingRequirement>

export type AuthorChildEntitiesKeysTuple =
  EntityNameToChildKeyTuple<AuthorRelatedEntityTuple>

/* const author: Author = {
  articlesIds: [],
  blogsIds: [],
  id: "",
  recordedEventsIds: [],
  translations: [
    {
      id: "",
      languageId: "",
      name: "", // ?
    },
  ],
  type: "author",
}; */
