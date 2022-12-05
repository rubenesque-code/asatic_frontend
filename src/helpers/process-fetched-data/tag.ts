import { Tag } from "^types/entities"

export function validateTagAsChild(tag: Tag) {
  if (!tag.text?.length) {
    return false
  }

  return true
}
