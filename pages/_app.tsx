import "../styles/globals.css"
import type { AppProps } from "next/app"

import GlobalStyles from "../styles/GlobalStyles"
import { SiteLanguageProvider } from "^context/SiteLanguage"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SiteLanguageProvider>
        <Component {...pageProps} />
      </SiteLanguageProvider>
      <GlobalStyles />
    </>
  )
}

export default MyApp
