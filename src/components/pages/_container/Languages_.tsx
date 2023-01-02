import Link from "next/link"
import { useRouter } from "next/router"
import tw from "twin.macro"
import { TranslateIcon } from "^components/Icons"

import { Language } from "^types/entities"

export type Languages_Props = {
  documentLanguages: Language[]
  documentLanguage: Language
}

export const Languages_ = ({
  documentLanguages,
  documentLanguage,
}: Languages_Props) => {
  const router = useRouter()

  if (!documentLanguages.length || documentLanguages.length < 2) {
    return null
  }

  return (
    <div css={[tw`flex items-center gap-sm`]}>
      <div css={[tw`text-gray-400`]}>
        <TranslateIcon weight="light" />
      </div>
      <div css={[tw`flex gap-xs items-center`]}>
        {documentLanguages.map((language) => (
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
            key={language.id}
          >
            <div
              css={[
                tw`py-0.5 px-2 border rounded-md text-sm font-serif-secondary tracking-wide text-gray-700 transition-colors ease-in-out`,
                language.id !== documentLanguage.id &&
                  tw`text-gray-400 cursor-pointer border-gray-100`,
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
