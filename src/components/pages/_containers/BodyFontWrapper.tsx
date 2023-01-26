import { ReactElement } from "react"
import tw from "twin.macro"

export const BodyFontWrapper = ({
  children,
  documentLanguageId,
}: {
  children: ReactElement | (ReactElement | null)[]
  documentLanguageId: string
}) => {
  return (
    <div
      css={[
        documentLanguageId === "tamil"
          ? tw`font-serif-primary-tamil`
          : tw`font-serif-primary`,
      ]}
    >
      {children}
    </div>
  )
}
