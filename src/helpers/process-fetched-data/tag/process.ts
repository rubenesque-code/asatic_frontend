import { sanitize } from "dompurify"
import { Tag } from "^types/entities"

export function processTag(tag: Tag) {
  const { text, ...restOfTag } = tag
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { text: sanitize(text!), restOfTag }
}

export function processTags(tags: Tag[]) {
  return tags.map(processTag)
}
