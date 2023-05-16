import { Tag } from "^types/entities"

export function validateTagAsChild(tag: Tag) {
  if (!tag.text?.length) {
    return false
  }

  return true
}

export function filterValidTags(tags: Tag[]) {
  return tags.filter((tag) => validateTagAsChild(tag))
}
