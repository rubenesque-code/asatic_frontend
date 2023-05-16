import { ComponentProps } from "react"
import { GlobalDataProvider } from "^context/GlobalData"
import { MyOmit } from "./utilities"

export type StaticDataWrapper<TPageData extends Record<string, unknown>> = {
  globalData: MyOmit<ComponentProps<typeof GlobalDataProvider>, "children">
  pageData: TPageData
}
