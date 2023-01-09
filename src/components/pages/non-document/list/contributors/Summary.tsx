import Link from "next/link"
import { useRouter } from "next/router"
import tw from "twin.macro"

import { routes } from "^constants/routes"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { determineChildTranslation } from "^helpers/document"
import { $link } from "^styles/global"
import { StaticData } from "./staticData"

const Summary = ({
  author,
  sortLanguageId,
}: {
  author: StaticData["authors"]["authors"][number]
  sortLanguageId: string | null
}) => {
  const { siteLanguage } = useSiteLanguageContext()

  const translation = determineChildTranslation(
    author.translations,
    sortLanguageId || siteLanguage.id
  )

  const router = useRouter()

  const pathname = `${routes.subjects}/${author.id}`

  return (
    <Link
      href={{
        pathname,
        query: {
          ...router.query,
          documentLanguageId: translation.languageId,
        },
      }}
      passHref
    >
      <h3 css={[tw`text-xl cursor-pointer`, $link]}>{translation.name}</h3>
    </Link>
  )
}

export default Summary
