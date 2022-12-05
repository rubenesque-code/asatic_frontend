import { ArticleLikeEntity } from "./article-like-entity"
import { MyOmit } from "./utilities"

export type Article = ArticleLikeEntity<"article">

export type FetchedArticle = MyOmit<Article, "publishStatus">

export type SanitisedArticle = MyOmit<
  FetchedArticle,
  "lastSave" | "publishDate"
> & { publishDate: string }

/*
 const article: Article = {
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
    useImage: true, // ?
    vertPosition: 50, //  ?
  },
  tagsIds: [],
  translations: [
    {
      body: [],
      id: "",
      languageId: "",
      summary: {
        collection: "", // ?
        general: "", // ?
        landingCustomSection: "", // ?
      },
      title: '' // ?
    },
  ],
  type: "article",
  publishDate: new Date(), // ?
};
 */
