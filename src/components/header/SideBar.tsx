import { Menu } from "@headlessui/react"
import Link from "next/link"
import { CaretDown, CaretUp, List, X } from "phosphor-react"
import { useState } from "react"
import tw from "twin.macro"

import { routes } from "^constants/routes"
import { siteTranslations } from "^constants/siteTranslations"
import { useSiteLanguageContext } from "^context/SiteLanguage"
import { findTranslation } from "^helpers/data"
import { SanitisedSubject } from "^types/entities"

export type SideBarProps = SubjectsProp

type SubjectsProp = {
  subjects: SanitisedSubject[]
}

const SideBar = (subjectsProp: SideBarProps) => {
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
            <Content {...subjectsProp} />
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

const Content = (subjectsProp: SubjectsProp) => {
  const { siteLanguage } = useSiteLanguageContext()

  return (
    <div css={[tw`mt-lg`]}>
      <CloseButton />
      <div css={[tw`flex flex-col gap-md min-w-[200px] mt-md`]}>
        <div css={[tw`pt-md border-t`]}>
          <PageLink
            label={siteTranslations.home[siteLanguage.id]}
            route={routes.landing}
          />
        </div>
        <div css={[tw`pt-md border-t`]}>
          <PageLink
            label={siteTranslations.articles[siteLanguage.id]}
            route={routes.articles}
          />
        </div>
        <div css={[tw`pt-md border-t`]}>
          <Subjects {...subjectsProp} />
        </div>
      </div>
    </div>
  )
}

export default SideBar

const $text = tw`font-sans-primary font-light tracking-wide capitalize text-lg text-gray-700 transition-colors ease-in-out`
const $link = tw`hover:text-blue-900 cursor-pointer`

const PageLink = ({ label, route }: { label: string; route: string }) => {
  return (
    <Link href={route}>
      <div css={[$text, $link]}>{label}</div>
    </Link>
  )
}

const Subjects = ({ subjects }: { subjects: SanitisedSubject[] }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!subjects.length) {
    return null
  }

  return (
    <div>
      <div
        css={[tw`flex items-center justify-between cursor-pointer`]}
        className="group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span css={[$text, tw`group-hover:text-gray-900`]}>Subjects</span>
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
        {subjects.map((subject) => (
          <Subject subject={subject} key={subject.id} />
        ))}
      </div>
    </div>
  )
}

const Subject = ({ subject }: { subject: SanitisedSubject }) => {
  const { siteLanguage } = useSiteLanguageContext()

  const translationForSiteLanguage = findTranslation(
    subject.translations,
    siteLanguage.id
  )

  if (
    !translationForSiteLanguage ||
    !translationForSiteLanguage.title?.length
  ) {
    return null
  }

  return (
    <Link href={`/subjects/${subject.id}`} passHref>
      <div css={[$text, $link]}>{translationForSiteLanguage.title}</div>
    </Link>
  )
}
