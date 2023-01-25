import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useLayoutEffect } from "react"

import { routes } from "^constants/routes"

import { StaticData } from "^components/pages/list/collections/staticData"
import PageContent from "^components/pages/list/collections"

export { getStaticProps } from "^components/pages/list/collections/staticData"

const CollectionsPage: NextPage<StaticData> = (staticData) => {
  const isCollection = staticData.collections.entities.length

  const router = useRouter()

  useLayoutEffect(() => {
    if (isCollection) {
      return
    }

    router.push({ pathname: routes.landing, query: router.query })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollection])

  return <PageContent {...staticData} />
}

export default CollectionsPage
