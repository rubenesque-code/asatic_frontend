import {
  EntityGlobalFields,
  EntityNameTupleSubset,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity"
import { ImageFields, SummaryImageField } from "./entity-image"
import { TupleToUnion } from "./utilities"
import { MyOmit } from "^types/utilities"

type CollectionRelatedEntityTuple = EntityNameTupleSubset<
  "article" | "blog" | "recordedEvent" | "subject" | "tag"
>

type CollectionRelatedEntity = TupleToUnion<CollectionRelatedEntityTuple>

export type DbCollection = EntityGlobalFields<"collection"> & {
  bannerImage: ImageFields<"id" | "y-position">
} & RelatedEntityFields<CollectionRelatedEntity> &
  PublishFields &
  SaveFields &
  SummaryImageField<"isNotToggleable"> & {
    languageId: string
    description?: string
    summary?: string
    title: string
  }

export type FetchedCollection = MyOmit<DbCollection, "publishStatus">

export type SanitisedCollection = MyOmit<
  FetchedCollection,
  "lastSave" | "publishDate"
> & { publishDate: string }
