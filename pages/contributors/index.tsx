import type { NextPage } from "next"

import { StaticData } from "^components/pages/list/contributors/staticData"
import PageContent from "^components/pages/list/contributors"
import { useRouter } from "next/router"
import { useLayoutEffect } from "react"
import { routes } from "^constants/routes"

export { getStaticProps } from "^components/pages/list/contributors/staticData"

const ContributorsPage: NextPage<StaticData> = (staticData) => {
  const isMultipleAuthors = staticData.isMultipleAuthors

  const router = useRouter()

  useLayoutEffect(() => {
    if (isMultipleAuthors) {
      return
    }

    router.push({ pathname: routes.landing, query: router.query })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMultipleAuthors])

  return <PageContent {...staticData} />
}

export default ContributorsPage
