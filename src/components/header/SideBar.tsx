import { Menu } from "@headlessui/react"
import Link from "next/link"
import { CaretDown, CaretUp, List, X } from "phosphor-react"
import { useState } from "react"
import tw from "twin.macro"

import { useSiteLanguageContext } from "^context/SiteLanguage"

import { routes } from "^constants/routes"
import { siteTranslations } from "^constants/siteTranslations"
import { $link } from "^styles/global"
import { useGlobalDataContext } from "^context/GlobalData"
import { processSubjectsAsLinks } from "^helpers/process-fetched-data/subject/process"

const SideBar = () => {
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
              tw`z-10 fixed top-0 left-0 visible w-screen h-screen bg-overlay-mid`,
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

  return (
    <div
      css={[
        siteLanguage.id === "tamil"
          ? tw`font-sans-primary-tamil`
          : tw`font-sans-primary`,
        tw`mt-lg`,
      ]}
    >
      <CloseButton />
      <div css={[tw`flex flex-col gap-md mt-md min-w-[200px]`]}>
        <PageLink
          label={siteTranslations.home[siteLanguage.id]}
          pathname={routes.landing}
        />
        <PageLink
          label={siteTranslations.articles[siteLanguage.id]}
          pathname={routes.articles}
        />
        <PageLink
          label={siteTranslations.blogs[siteLanguage.id]}
          pathname={routes.blogs}
        />
        <PageLink
          label={siteTranslations.recordedEvents[siteLanguage.id]}
          pathname={routes.recordedEvents}
        />
        <CollectionsLink />
        <Subjects />
      </div>
    </div>
  )
}

export default SideBar

const $text = tw`font-light tracking-wide capitalize text-lg text-gray-700 `

const PageLink = ({ label, pathname }: { label: string; pathname: string }) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div css={[tw`pt-md border-t`]}>
      <Link href={{ pathname, query: { siteLanguageId: siteLanguage.id } }}>
        <div css={[$text, $link]}>{label}</div>
      </Link>
    </div>
  )
}

const Subjects = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const { siteLanguage } = useSiteLanguageContext()
  const { subjects } = useGlobalDataContext()

  if (!subjects.length) {
    return null
  }

  const subjectsForSiteLanguage = subjects.filter(
    (subject) => subject.languageId === siteLanguage.id
  )

  return (
    <div css={[tw`pt-md border-t`]}>
      <div
        css={[tw`flex items-center justify-between cursor-pointer`]}
        className="group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span css={[$text, tw`group-hover:text-gray-900`]}>
          {siteTranslations["subjects"][siteLanguage.id]}
        </span>
        <span css={[tw`group-hover:bg-gray-50 rounded-full p-xxxs`]}>
          {isExpanded ? <CaretUp /> : <CaretDown />}
        </span>
      </div>
      <div
        css={[
          tw`ml-sm flex flex-col gap-sm mt-md`,
          !isExpanded ? tw`max-h-0 opacity-10` : tw`max-h-full opacity-100`,
          tw`overflow-hidden transition-all ease-in-out duration-150`,
        ]}
      >
        {subjectsForSiteLanguage.map((subject) => (
          <Subject subject={subject} key={subject.id} />
        ))}
      </div>
    </div>
  )
}

const Subject = ({
  subject,
}: {
  subject: ReturnType<typeof processSubjectsAsLinks>[number]
}) => {
  return (
    <Link href={`/subjects/${subject.id}`} passHref>
      <div css={[$text, $link]}>{subject.title}</div>
    </Link>
  )
}

const CollectionsLink = () => {
  const { siteLanguage } = useSiteLanguageContext()
  const { isCollection } = useGlobalDataContext()

  if (!isCollection) {
    return null
  }

  return (
    <PageLink
      label={siteTranslations.collections[siteLanguage.id]}
      pathname={routes.collections}
    />
  )
}
