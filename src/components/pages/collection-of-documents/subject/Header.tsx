import tw from "twin.macro"

const DocumentHeader = ({
  title,
  languageId,
}: {
  title: string
  languageId: string
}) => {
  return (
    <div
      css={[
        tw`pb-lg border-b`,
        languageId === "tamil"
          ? tw`font-serif-primary-tamil`
          : tw`font-serif-primary`,
      ]}
    >
      <h2 css={[tw`text-center text-3xl`]}>{title}</h2>
    </div>
  )
}

export default DocumentHeader
