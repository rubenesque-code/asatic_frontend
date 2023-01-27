import { GlobalDataValue } from "^context/GlobalData"
import { MyOmit } from "^types/utilities"
import { fetchAndValidateAuthors } from "./authors"
import { fetchAndValidateCollections } from "./collections"
import { fetchAndValidateLanguages } from "./languages"
import { fetchAndValidateSubjects } from "./subjects"

export async function fetchAndValidateGlobalData() {
  const validLanguages = await fetchAndValidateLanguages("all")
  const validSubjects = await fetchAndValidateSubjects({
    ids: "all",
    validLanguageIds: validLanguages.ids,
  })
  const validAuthors = await fetchAndValidateAuthors({
    ids: "all",
    validLanguageIds: validLanguages.ids,
  })
  const validCollections = await fetchAndValidateCollections({
    ids: "all",
    validLanguageIds: validLanguages.ids,
  })

  const globalContextData: MyOmit<GlobalDataValue, "documentLanguageIds"> = {
    isCollection: validCollections.entities.length > 0,
    isMultipleAuthors: validAuthors.entities.length > 1,
    subjects: validSubjects.entities,
  }

  return {
    globalContextData,
    validatedData: {
      allSubjects: validSubjects,
      allCollections: validCollections,
      allLanguages: validLanguages,
      allAuthors: validAuthors,
    },
  }
}

export type GlobalDataValidated = Awaited<
  ReturnType<typeof fetchAndValidateGlobalData>
>["validatedData"]
