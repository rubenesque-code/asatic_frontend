import tw from "twin.macro"
import Link from "next/link"

import { StaticData } from "./staticData"

import { Languages_, PageLayout_ } from "^components/pages/_containers"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { siteTranslations } from "^constants/siteTranslations"
import { mapIds } from "^helpers/data"
import { useDetermineDocumentLanguage } from "^hooks/useDetermineDocumentLanguage"
import { sortEntitiesByDate } from "^helpers/manipulateEntity"

const SubjectsPageContent = ({
  subjects,
  header,
  isMultipleAuthors,
}: StaticData) => {
  return (
    <PageLayout_
      staticData={{
        isMultipleAuthors,
        subjects: header.subjects,
        documentLanguageIds: mapIds(subjects.languages),
      }}
    >
      <PageBody subjects={subjects} />
    </PageLayout_>
  )
}

export default SubjectsPageContent

const PageBody = ({ subjects }: { subjects: StaticData["subjects"] }) => {
  const { siteLanguage } = useSiteLanguageContext()

  const { documentLanguage: filterLanguage } = useDetermineDocumentLanguage(
    subjects.languages
  )

  const subjectsProcessed = sortEntitiesByDate(
    subjects.entities.filter(
      (subject) => subject.languageId === filterLanguage.id
    )
  )

  return (
    <div>
      <div css={[tw`border-b`]}>
        <$SectionContent css={[tw`px-sm pt-xl pb-md border-r-0 border-l-0`]}>
          <h1 css={[tw`text-3xl capitalize text-gray-700 text-center`]}>
            {siteTranslations.subjects[siteLanguage.id]}
          </h1>
          <div css={[tw`pt-sm`]}>
            <Languages_
              documentLanguage={filterLanguage}
              documentLanguages={subjects.languages}
            />
          </div>
        </$SectionContent>
      </div>
      <div css={[tw`border-b`]}>
        <$SectionContent>
          <div css={[tw`flex justify-center py-2xl`]}>
            <div css={[tw`grid grid-cols-3`]}>
              {subjectsProcessed.map((subject, i) => (
                <div css={[tw`flex items-center gap-sm`]} key={subject.id}>
                  {i > 0 ? (
                    <div css={[tw`h-[25px] w-[1px] bg-gray-200`]} />
                  ) : null}
                  <Link href={{}} passHref>
                    <div css={[tw`text-xl`]}>{subject.title}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </$SectionContent>
      </div>
    </div>
  )
}

const $SectionContent = tw.div`border-l border-r mx-xxs sm:mx-sm md:mx-md`
