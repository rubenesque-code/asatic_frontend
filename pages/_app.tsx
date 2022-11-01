import "../styles/globals.css"
import type { AppProps } from "next/app"

import GlobalStyles from "../styles/GlobalStyles"
import { SiteLanguageProvider } from "^context/SiteLanguage"
import Layout from "^components/Layout"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SiteLanguageProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SiteLanguageProvider>
      <GlobalStyles />
    </>
  )
}

export default MyApp
