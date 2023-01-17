import Link from "next/link"
import { useRouter } from "next/router"
import { ReactElement } from "react"
import { routes } from "^constants/routes"

export const EntityLink_ = ({
  children,
  documentLanguageId,
  routeKey,
  entityId,
}: {
  children: ReactElement
  documentLanguageId: string
  routeKey: keyof typeof routes
  entityId: string
}) => {
  const router = useRouter()
  const pathname = `${routes[routeKey]}/${entityId}`

  return (
    <Link
      href={{
        pathname,
        query: {
          ...router.query,
          documentLanguageId: documentLanguageId,
        },
      }}
      passHref
    >
      {children}
    </Link>
  )
}
