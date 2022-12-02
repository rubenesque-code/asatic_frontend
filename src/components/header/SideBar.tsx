import { Menu } from "@headlessui/react"
import Link from "next/link"
import { List, X } from "phosphor-react"
import tw from "twin.macro"
import { routes } from "^constants/routes"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { Subject } from "^types/subject"

//todo: overlay transition doesn't work cleanly because of it being hidden

// todo: need to pass in e.g. subjects at build time so remove header from _app.tsx
const SideBar = ({ subjects }: { subjects: Subject[] }) => {
  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button css={[tw`text-3xl`]}>
            <List weight="thin" />
          </Menu.Button>
          <Menu.Items
            css={[
              tw`bg-white h-full py-sm pl-md pr-md border-r-2`,
              tw`z-40 fixed top-0 left-0 transition-all ease-in duration-300`,
              open
                ? tw`translate-x-0 opacity-100`
                : tw`-translate-x-full opacity-0`,
            ]}
            static
          >
            <Content />
          </Menu.Items>
          <div
            css={[
              tw`fixed top-0 left-0 visible w-screen h-screen bg-overlay-mid`,
              tw`transition-opacity ease-in duration-300`,
              open ? tw`opacity-100` : tw` opacity-0 hidden`,
            ]}
          />
        </>
      )}
    </Menu>
  )
}

const CloseButton = () => (
  <Menu.Item>
    <div css={[tw`text-2xl cursor-pointer`]}>
      <X />
    </div>
  </Menu.Item>
)

const Content = () => {
  const { siteLanguage } = useSiteLanguageContext()

  const pageLinks = [
    {
      label: siteTranslations.home[siteLanguage],
      route: routes.landing,
    },
    {
      label: siteTranslations.articles[siteLanguage],
      route: routes.articles,
    },
  ]

  return (
    <div css={[tw`mt-lg`]}>
      <CloseButton />
      <div css={[tw`flex flex-col gap-md min-w-[200px] mt-md`]}>
        {pageLinks.map((link) => (
          <div css={[tw`pt-md border-t`]} key={link.label}>
            <PageLink {...link} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar

const PageLink = ({ label, route }: { label: string; route: string }) => {
  return (
    <Link href={route}>
      <div
        css={[
          tw`font-serif-body capitalize text-lg cursor-pointer text-gray-700 hover:text-blue-900 transition-colors`,
        ]}
      >
        {label}
      </div>
    </Link>
  )
}
