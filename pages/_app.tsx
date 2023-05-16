import "../styles/globals.css"
import type { AppProps } from "next/app"
import { GoogleAnalytics } from "nextjs-google-analytics"

import GlobalStyles from "../styles/GlobalStyles"
import { SiteLanguageProvider } from "^context/SiteLanguage"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SiteLanguageProvider>
        <Component {...pageProps} />
      </SiteLanguageProvider>
      <GoogleAnalytics trackPageViews />
      <GlobalStyles />
    </>
  )
}

export default MyApp
