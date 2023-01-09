import { getLandingUserSectionsUniqueChildIds } from "^helpers/process-fetched-data/landing/query"
import { validateUserSection } from "^helpers/process-fetched-data/landing/validate"
import { fetchLanding } from "^lib/firebase/firestore"
import { fetchAndValidateArticles } from "./articles"
import { fetchAndValidateBlogs } from "./blogs"
import { fetchAndValidateRecordedEvents } from "./recordedEvents"

export async function fetchAndValidateLanding({
  validLanguageIds,
}: {
  validLanguageIds: string[]
}) {
  const sections = await fetchLanding()

  const userSections = sections.flatMap((section) =>
    section.type === "user" ? section : []
  )

  const userChildIds = getLandingUserSectionsUniqueChildIds(userSections)

  const validArticles = await fetchAndValidateArticles({
    ids: userChildIds.articles,
    validLanguageIds,
  })
  const validBlogs = await fetchAndValidateBlogs({
    ids: userChildIds.blogs,
    validLanguageIds,
  })
  const validRecordedEvents = await fetchAndValidateRecordedEvents({
    ids: userChildIds.recordedEvents,
    validLanguageIds,
  })

  const validUserSections = userSections.filter((section) =>
    validateUserSection(section, {
      validDocumentEntityIds: {
        articles: validArticles.ids,
        blogs: validBlogs.ids,
        recordedEvents: validRecordedEvents.ids,
      },
    })
  )

  const autoSections = sections.flatMap((section) =>
    section.type === "auto" ? section : []
  )

  return [...validUserSections, ...autoSections]
}
