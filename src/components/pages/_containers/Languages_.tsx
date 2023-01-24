import Link from "next/link"
import { useRouter } from "next/router"
import tw from "twin.macro"
import { TranslateIcon } from "^components/Icons"
import { sortLanguages } from "^helpers/manipulateEntity"

import { Language } from "^types/entities"

export type Languages_Props = {
  documentLanguages: Language[]
  documentLanguage: Language
  color?: "light" | "dark"
}

export const Languages_ = ({
  documentLanguages,
  documentLanguage,
  color = "light",
}: Languages_Props) => {
  const router = useRouter()

  if (!documentLanguages.length || documentLanguages.length < 2) {
    return null
  }

  const processedLanguages = sortLanguages(documentLanguages)

  return (
    <div css={[tw`flex items-center gap-sm`]}>
      <div css={[color === "light" ? tw` text-gray-400` : tw`text-gray-500`]}>
        <TranslateIcon weight="light" />
      </div>
      <div css={[tw`flex gap-xs items-center`]}>
        {processedLanguages.map((language) => (
          <Link
            href={{
              pathname: router.pathname,
              query: {
                ...router.query,
                documentLanguageId: language.id,
              },
            }}
            shallow={true}
            passHref
            replace
            key={language.id}
          >
            <div
              css={[
                tw`py-0.5 px-2 border rounded-md text-sm font-serif-secondary tracking-wide text-gray-700 transition-colors ease-in-out`,
                color === "dark" && tw`border-gray-900 text-gray-800`,
                language.id !== documentLanguage.id &&
                  tw`text-gray-400 cursor-pointer border-gray-100`,
                language.id !== documentLanguage.id &&
                  color === "dark" &&
                  tw`border-gray-400 text-gray-500`,
              ]}
            >
              {language.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
