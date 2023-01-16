import { DisplayEntityStatus, EntityAsChildStatus } from "./entity-status"
import {
  EntityGlobalFields,
  EntityNameTupleSubset,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity"
import { RichText, TranslationField, Translations } from "./entity-translation"
import { ImageFields, SummaryImageField } from "./entity-image"
import { TupleToUnion } from "./utilities"
import { MyOmit } from "^types/utilities"

type CollectionTranslationFields = TranslationField<"title"> & {
  description?: RichText
  summary?: string
}

export type CollectionTranslation = DbCollection["translations"][number]

export type CollectionRelatedEntityTuple = EntityNameTupleSubset<
  "article" | "blog" | "recordedEvent" | "subject" | "tag"
>

export type CollectionRelatedEntity = TupleToUnion<CollectionRelatedEntityTuple>

export type InvalidReason =
  | "no banner image"
  | "no valid translation"
  | "no valid related diplay entity"

export type CollectionStatus = DisplayEntityStatus<
  CollectionRelatedEntity,
  InvalidReason
>

export type ChildCollectionMissingRequirement =
  | "no banner image"
  | "no valid translation"

export type CollectionAsChildStatus =
  EntityAsChildStatus<ChildCollectionMissingRequirement>

export type DbCollection = EntityGlobalFields<"collection"> & {
  bannerImage: ImageFields<"id" | "y-position">
} & RelatedEntityFields<CollectionRelatedEntity> &
  PublishFields &
  SaveFields &
  Translations<CollectionTranslationFields> &
  SummaryImageField<"isNotToggleable">

export type FetchedCollection = MyOmit<DbCollection, "publishStatus">

export type SanitisedCollection = MyOmit<
  FetchedCollection,
  "lastSave" | "publishDate"
> & { publishDate: string }

/*
const collection: Collection = {
  articlesIds: [],
  bannerImage: {
    imageId: "", // ?
    vertPosition: 50, // ?
  },
  blogsIds: [],
  id: "",
  lastSave: new Date(),
  publishStatus: "draft",
  recordedEventsIds: [],
  subjectsIds: [],
  summaryImage: {
    imageId: "", // ?
    vertPosition: 50, // ?
  },
  tagsIds: [],
  translations: [
    {
      description: "", // ?
      id: "",
      languageId: "",
      summary: {
        general: "", // ?
      },
      title: "", // ?
    },
  ],
  type: "collection",
  publishDate: new Date(), // ?
};
*/
