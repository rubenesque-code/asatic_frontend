import { ReactElement } from "react"
import { Subject } from "^types/subject"

import Header from "./header"

const Layout = ({
  children,
  subjects,
}: {
  children: ReactElement
  subjects: Subject[]
}) => {
  return (
    <div>
      <Header subjects={subjects} />
      {children}
    </div>
  )
}

export default Layout
