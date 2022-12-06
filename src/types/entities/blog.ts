import { ArticleLikeEntity } from "./article-like-entity"
import { MyOmit } from "./utilities"

export type DbBlog = ArticleLikeEntity<"blog">

export type FetchedBlog = MyOmit<DbBlog, "publishStatus">

export type SanitisedBlog = MyOmit<FetchedBlog, "lastSave" | "publishDate"> & {
  publishDate: string
}
