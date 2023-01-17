/* eslint-disable @typescript-eslint/no-non-null-assertion */
import tw from "twin.macro"
import { determineChildTranslation } from "^helpers/document"
import { StaticData } from "../staticData"

import {
  $ChildSummaryContainer,
  SummaryImage,
  SummaryText,
} from "^components/pages/_collections/DocumentSummary"
import { useRouter } from "next/router"
import { routes } from "^constants/routes"
import Link from "next/link"
import { $link } from "^styles/global"

const Collection = ({
  collection,
  parentCurrentLanguageId,
  index,
}: {
  collection: StaticData["subject"]["collections"][number]
  parentCurrentLanguageId: string
  index: number
}) => {
  const translation = determineChildTranslation(
    collection.translations,
    parentCurrentLanguageId
  )

  const router = useRouter()
  const pathname = `${routes.collections}/${collection.id}`

  return (
    <$ChildSummaryContainer css={[index !== 0 && tw`border-l`]}>
      <div css={[tw`max-w-full max-h-full flex flex-col`]}>
        <SummaryImage image={collection.summaryImage!} styles={tw`mb-xs`} />
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
          <h3 css={[tw`text-xl mb-xxs`, $link]}>{translation.title}</h3>
        </Link>
        <SummaryText
          htmlStr={translation.summaryText!}
          languageId={translation.languageId}
          maxCharacters={200}
        />
      </div>
    </$ChildSummaryContainer>
  )
}

export default Collection
