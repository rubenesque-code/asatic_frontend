import { StaticData } from "./staticData"

import { $PageBody } from "^components/pages/_styles"
import Header from "^components/header"
import { $CenterMaxWidth_ } from "^components/pages/_presentation"
import { $nonDocumentMaxWidth } from "^styles/global"
import PageBody from "./PageBody"
import { useLayoutEffect } from "react"
import { useRouter } from "next/router"

const AuthorsPage = ({ authors, header }: StaticData) => {
  const router = useRouter()

  useLayoutEffect(() => {
    console.log(router)
    console.log(window.history)

    if (authors.authors.length < 2) {
      router.push("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Header {...header} />
      <$PageBody>
        <$CenterMaxWidth_ maxWidth={$nonDocumentMaxWidth}>
          <PageBody {...authors} />
        </$CenterMaxWidth_>
      </$PageBody>
    </>
  )
}

export default AuthorsPage
