export function processSubjectForOwnPage({
  subject,
  validLanguageIds,
  validChildren,
}: {
  subject: SanitisedSubject
  validLanguageIds: string[]
  validChildren: {
    articles: SanitisedArticle[]
    blogs: SanitisedBlog[]
    collections: SanitisedCollection[]
    recordedEvents: SanitisedRecordedEvent[]
  }
}) {
  // remove invalid translations; remove empty translation sections.
  const processedTranslations = produce(subject.translations, (draft) => {
    for (let i = 0; i < draft.length; i++) {
      const translation = draft[i]

      const translationIsValid = validateTranslation(
        translation,
        validLanguageIds
      )

      if (!translationIsValid) {
        // const translationIndex = draft.findIndex((t) => t.id === translation.id)
        draft.splice(i, 1)
        break
      }
    }
  }) as ProcessedTranslation[]

  return processed
}
