import tw from "twin.macro"
import { Language } from "^types/entities"
import Article from "./child-summaries/article"

import { StaticData } from "./staticData"

const $ChildSummaryContainer = tw.div`p-xs`

const DocumentBody = ({
  documentLanguage,
  articles,
  blogs,
  recordedEvents,
}: {
  documentLanguage: Language
  articles: StaticData["subject"]["articles"]
  blogs: StaticData["subject"]["blogs"]
  recordedEvents: StaticData["subject"]["recordedEvents"]
}) => {
  const childEntitiesProcessed = {
    all: [...articles, ...blogs, ...recordedEvents],
    sortedByDate() {
      return this.all.sort((a, b) => {
        return (
          new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        )
      })
    },
    ensureFirstHasImage() {
      const arr = this.sortedByDate()
      const index = arr.findIndex((entity) => entity.summaryImage?.storageImage)

      if (index < 0) {
        return arr
      }

      const removed = arr.splice(index, 1)
      const newArr = [...removed, ...arr]

      return newArr
    },
    sections() {
      return {
        first: this.ensureFirstHasImage().slice(0, 5),
        second: this.ensureFirstHasImage().slice(
          5,
          this.ensureFirstHasImage().length
        ),
      }
    },
  }

  return (
    <div css={[tw`grid grid-cols-4 grid-rows-2 border-l border-r mx-md`]}>
      {childEntitiesProcessed.sections().first.map((entity, i) => (
        <$ChildSummaryContainer
          css={[
            i === 0 && tw`col-span-2 row-span-2 border-r h-[600px]`,
            i === 1 && tw`border-r`,
            i !== 0 && tw`max-h-[300px]`,
            tw`border-b`,
          ]}
          key={entity.id}
        >
          {entity.type === "article" ? (
            <Article
              article={entity}
              parentCurrentLanguageId={documentLanguage.id}
            />
          ) : (
            <div>Not Article</div>
          )}
        </$ChildSummaryContainer>
      ))}
    </div>
  )
}

export default DocumentBody
