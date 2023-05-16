export const defaultSiteLanguageId = "english"
export const secondDefaultSiteLanguageId = "tamil"

export const siteLanguageIds = [
  defaultSiteLanguageId,
  secondDefaultSiteLanguageId,
] as const

export type SiteLanguageId =
  | typeof defaultSiteLanguageId
  | typeof secondDefaultSiteLanguageId
