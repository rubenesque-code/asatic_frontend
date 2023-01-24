import React from "react"
import { Global } from "@emotion/react"
import tw, { theme, GlobalStyles as BaseStyles, css } from "twin.macro"

const customStyles = css({
  body: {
    color: theme`colors.black`,
    ...tw`antialiased`,
  },
})

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)

export default GlobalStyles
