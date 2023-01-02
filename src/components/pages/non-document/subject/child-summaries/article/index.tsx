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
    <div css={[tw`max-w-full `]}>
      <h3 css={[tw`text-xl`]}>{translation.title}</h3>
      <div
        css={[tw`max-w-none prose`]}
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
