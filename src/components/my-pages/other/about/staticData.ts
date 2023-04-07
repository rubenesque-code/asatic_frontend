import { GetStaticProps } from "next"
import { sanitize } from "isomorphic-dompurify"

import { fetchAndValidateGlobalData } from "^helpers/fetch-and-validate/global"

import { StaticDataWrapper } from "^types/staticData"
import { AboutPage } from "^types/entities/about"
import { fetchAbout } from "^lib/firebase/firestore"
import produce from "immer"

type PageData = {
  aboutPage: AboutPage
}

export type StaticData = StaticDataWrapper<PageData>

export const getStaticProps: GetStaticProps<StaticData> = async () => {
  const globalData = await fetchAndValidateGlobalData()

  const aboutPage = await fetchAbout()

  const processed = produce(aboutPage, (draft) => {
    draft.translations.forEach((translation) => {
      translation.text = sanitize(translation.text)
    })
  })

  return {
    props: {
      globalData: {
        ...globalData.globalContextData,
      },
      pageData: {
        aboutPage: processed,
      },
    },
  }
}
