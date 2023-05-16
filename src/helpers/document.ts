import { findTranslationByLanguageId } from "./data"
import {
  defaultSiteLanguageId,
  secondDefaultSiteLanguageId,
} from "^constants/languages"

export const formatDateDMYStr = (date: Date): string => {
  const day = date.getDate()
  const month = date.toLocaleDateString("default", { month: "long" })
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}
export const truncateText = (text: string, numChar: number) => {
  const subStr = text.substring(0, numChar)
  const isEllipsis =
    subStr.substring(subStr.length - 3, subStr.length) === "..."
  const truncatedText = `${subStr}${
    isEllipsis || subStr.length >= numChar ? "..." : ""
  }`

  return truncatedText
}

export function determineChildTranslation<
  TTranslation extends { languageId: string }
>(translations: TTranslation[], parentLanguageId: string) {
  const translation =
    findTranslationByLanguageId(translations, parentLanguageId) ||
    findTranslationByLanguageId(translations, defaultSiteLanguageId) ||
    findTranslationByLanguageId(translations, secondDefaultSiteLanguageId) ||
    translations[0]

  return translation
}
