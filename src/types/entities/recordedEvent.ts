import { MyOmit } from "^types/utilities"
import {
  EntityGlobalFields,
  EntityNameToChildKeyTuple,
  EntityNameTupleSubset,
  MediaFields,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity"
import { SummaryImageField } from "./entity-image"
import { DisplayEntityStatus } from "./entity-status"
import { RichText, TranslationField, Translations } from "./entity-translation"
import { TupleToUnion } from "./utilities"

type RecordedEventTranslationFields = TranslationField<"title"> & {
  body?: RichText
}

export type RecordedEventTranslation = DbRecordedEvent["translations"][number]

export type RecordedEventRelatedEntityTuple = EntityNameTupleSubset<
  "author" | "collection" | "recordedEventType" | "subject" | "tag"
>
export type RecordedEventRelatedEntity =
  TupleToUnion<RecordedEventRelatedEntityTuple>

export type MissingRecordedEventRequirement =
  | "no video"
  | "no valid translation"
  | "no video type"

export type RecordedEventStatus = DisplayEntityStatus<
  RecordedEventRelatedEntity,
  MissingRecordedEventRequirement
>

export type DbRecordedEvent = EntityGlobalFields<"recordedEvent"> &
  MediaFields<"youtubeId"> &
  RelatedEntityFields<RecordedEventRelatedEntity> &
  PublishFields &
  SaveFields &
  Translations<RecordedEventTranslationFields> &
  SummaryImageField<"isNotToggleable">

export type FetchedRecordedEvent = MyOmit<DbRecordedEvent, "publishStatus">

export type SanitisedRecordedEvent = MyOmit<
  FetchedRecordedEvent,
  "lastSave" | "publishDate"
> & { publishDate: string }

export type RecordedEventChildEntityFields =
  RelatedEntityFields<RecordedEventRelatedEntityUnion>

export type RecordedEventRelatedEntityUnion =
  TupleToUnion<RecordedEventRelatedEntityTuple>

export type RecordedEventChildEntitiesKeysTuple =
  EntityNameToChildKeyTuple<RecordedEventRelatedEntityTuple>

/*
const r: RecordedEvent = {
  authorsIds: [],
  collectionsIds: [],
  id: "",
  landingCustomSectionImage: {
    aspectRatio: 16 / 9, // ?
    vertPosition: 50, // ?
  },
  lastSave: new Date(),
  publishStatus: "draft",
  subjectsIds: [],
  summaryImage: {
    imageId: "", // ?
    vertPosition: 50, // ?
  },
  tagsIds: [],
  translations: [
    {
      id: "",
      languageId: "",
      body: "", // ?
      title: "", // ?
    },
  ],
  type: "recordedEvent",
  publishDate: new Date(), // ?
  youtubeId: "", // ?
  recordedEventTypeId: "", // ?
};
*/
