import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Tamil:wght@300;400&family=Arima+Madurai:wght@300;400;700&family=Arima:wght@300&family=Bitter:wght@300;400&family=Catamaran:wght@300;400&family=Lato:wght@300;400&family=Montserrat:wght@300;400&family=Nanum+Myeongjo:wght@400;700&family=Roboto+Mono&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
