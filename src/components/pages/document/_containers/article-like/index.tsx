import { Publishable } from '^types/index'

import { $Date } from '../../_styles/article-like'

export const Date_ = ({ date }: { date: Publishable['publishDate'] }) => {
  if (!date) {
    return null
  }

  return <$Date>{date}</$Date>
}
