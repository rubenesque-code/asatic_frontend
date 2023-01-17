// date turned into english date string on import from firebase (because firestore timestamp causes Next.js error. Could use another method)
export const DateString_ = ({
  engDateStr,
  languageId,
}: {
  engDateStr: string
  languageId: string
}) => {
  if (languageId === "english") {
    return <>{engDateStr}</>
  }

  const date = new Date(engDateStr)

  const day = date.getDate()
  const month =
    languageId === "tamil"
      ? date.toLocaleDateString("ta", { month: "long" })
      : date.getMonth() + 1
  const year = date.getFullYear()

  return <>{`${day} ${month} ${year}`}</>
}
