import { Expand, TupleToUnion } from "./utilities"

import { ImageFields } from "./entity-image"
import { RichText, TranslationField } from "./entity-translation"

import {
  EntityGlobalFields,
  PublishFields,
  SaveFields,
  EntityNameSubSet,
  ComponentFields,
  MediaFields,
  RelatedEntityFields,
  EntityNameTupleSubset,
  EntityNameToChildKeyTuple,
} from "./entity"
import { Translations } from "./entity-translation"
import { SummaryImageField } from "./entity-image"

type SectionTypes = "text" | "image" | "video" | "table"

type Section<TType extends SectionTypes> = ComponentFields<"id" | "index"> & {
  type: TType
}

export type TextSection = Section<"text"> & {
  text?: RichText
  footnotes?: Footnote[]
}

export type ImageSection = Section<"image"> &
  MediaFields<"caption"> & {
    image: ImageFields<"aspect-ratio" | "id" | "y-position">
  }

export type VideoSection = Section<"video"> &
  MediaFields<"caption" | "youtubeId">

export type Footnote = { id: string; num: number; text: string }

type Column = { accessor: string; Header: string }

type TableSection = Section<"table"> & {
  title: string | null
  notes: string | null
  columns: Column[]
  rows: ({ col1: string } & Record<string, string>)[]
  col1IsTitular: boolean
}

type ArticleLikeTranslationFields = TranslationField<"title"> & {
  body: (
    | Expand<TextSection>
    | Expand<ImageSection>
    | Expand<VideoSection>
    | TableSection
  )[]
  summary?: string
}

type ArticleLikeEntityName = EntityNameSubSet<"article" | "blog">

export type DbArticleLikeEntity<TEntityName extends ArticleLikeEntityName> =
  EntityGlobalFields<TEntityName> &
    RelatedEntityFields<ArticleLikeRelatedEntityUnion> &
    PublishFields &
    SaveFields &
    Translations<ArticleLikeTranslationFields> &
    SummaryImageField<"isToggleable">

export type ArticleLikeTranslation =
  Translations<ArticleLikeTranslationFields>["translations"][number]

export type ArticleLikeChildEntityFields =
  RelatedEntityFields<ArticleLikeRelatedEntityUnion>

export type ArticleLikeRelatedEntityTuple = EntityNameTupleSubset<
  "author" | "collection" | "subject" | "tag"
>

export type ArticleLikeRelatedEntityUnion =
  TupleToUnion<ArticleLikeRelatedEntityTuple>

export type ArticleLikeChildEntitiesKeysTuple =
  EntityNameToChildKeyTuple<ArticleLikeRelatedEntityTuple>

export type ArticleLikeSummaryType =
  | "default"
  | "collection"
  | "landing-user-section"
