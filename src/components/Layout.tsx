import { ReactElement } from "react"

import Header from "./header"

const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default Layout
