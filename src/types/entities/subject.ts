import {
  EntityGlobalFields,
  EntityNameSubSet,
  EntityNameTupleSubset,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity"
import { MyOmit, TupleToUnion } from "./utilities"

export type DbSubject = EntityGlobalFields<"subject"> &
  PublishFields &
  SaveFields &
  RelatedEntityFields<SubjectRelatedEntity> & {
    languageId: string
    title?: string
  }

export type FetchedSubject = MyOmit<DbSubject, "publishStatus">

export type SanitisedSubject = MyOmit<
  FetchedSubject,
  "lastSave" | "publishDate"
> & { publishDate: string }

export type SubjectRelatedEntityTuple = EntityNameTupleSubset<
  "article" | "blog" | "collection" | "recordedEvent" | "tag"
>

export type SubjectRelatedEntity = TupleToUnion<SubjectRelatedEntityTuple>

export type SubjectDisplayEntity = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent"
>
