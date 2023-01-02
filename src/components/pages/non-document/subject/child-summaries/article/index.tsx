import tw from "twin.macro"
import HtmlStrToJSX from "^components/HtmlStrToJSX"
import {
  defaultSiteLanguageId,
  secondDefaultSiteLanguageId,
} from "^constants/languages"
import { findEntityByLanguageId } from "^helpers/data"
import { StaticData } from "../../staticData"

const Article = ({
  article,
  parentCurrentLanguageId,
}: {
  article: StaticData["subject"]["articles"][number]
  parentCurrentLanguageId: string
}) => {
  const translation =
    findEntityByLanguageId(article.translations, parentCurrentLanguageId) ||
    findEntityByLanguageId(article.translations, defaultSiteLanguageId) ||
    findEntityByLanguageId(article.translations, secondDefaultSiteLanguageId) ||
    article.translations[0]

  return (
    <div css={[tw`max-w-full max-h-full flex flex-col`]}>
      <h3 css={[tw`text-xl pb-xs`]}>{translation.title}</h3>
      <div
        css={[tw`flex-grow  overflow-hidden`]}
        className="custom-prose"
        style={{
          width: "auto",
        }}
      >
        <HtmlStrToJSX text={translation.summaryText} />
      </div>
    </div>
  )
}

export default Article
