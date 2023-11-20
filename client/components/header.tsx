"use client";

import Link from 'next/link'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faNewspaper,
  faTags,
  faUserTie,
  faClone,
  faBinoculars,
//   faComment,
//   faPeopleGroup,
  faRss,
  faQ
} from "@fortawesome/free-solid-svg-icons"

import { cnLogo } from "@/src/styles/classnames.tailwind"
import { usePathname } from 'next/navigation';
import { getAppStaticSettings } from '@/src/store/settingAtoms';

const cname = (isActive: boolean, activeCname: string) => {

    if (isActive) {
      return 'text-sm py-4 ' + activeCname
    }
    return 'text-white text-sm py-4'
}

export const HeaderComponent = ()  => {
    
    const pathname = usePathname()

    const appStaticSettings = getAppStaticSettings()
    const appTitle = appStaticSettings.appName
    
    return <div className={ `${ appStaticSettings.bg } navbar` }>
        <div>
            <h1 className={ appStaticSettings.txtEvidence }>
                <FontAwesomeIcon icon={faQ} />
                <span>rated</span>
            </h1>
            <h2 className={ cnLogo }>{ appTitle }</h2>
            <nav>
                <ul className="hiddenX md:flexX flex-autoX space-x-2X px-2">
                    <li  className={ cname(pathname.indexOf('articles') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faNewspaper} />
                        <Link href="/articles">Articles</Link>
                    </li>
                    <li className="separate"><span /></li>
                    <li  className={ cname(pathname.indexOf('tags') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faTags} />
                        <Link href="/tags">Tags</Link>
                    </li>
                    <li  className={ cname(pathname.indexOf('categories') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faClone} />
                        <Link href="/categories">Categories</Link>
                    </li>
                    <li  className={ cname(pathname.indexOf('authors') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faUserTie} />
                        <Link href="/authors">Authors</Link>
                    </li>
                    <li  className={ cname(pathname.indexOf('watchlists') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faBinoculars} />
                        <Link href="/watchlists">WatchLists</Link>
                    </li>
                    {/* <li  className={ cname(pathname.indexOf('comments') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faComment} />
                        <Link href="/comments">Comments</Link>
                    </li> */}
                    <li className="separate"><span /></li>
                    {/* <li  className={ cname(pathname.indexOf('reviewers') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faPeopleGroup} />
                        <Link href="/reviewers">Reviewers</Link>
                    </li> */}
                    <li  className={ cname(pathname.indexOf('etl') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faRss} />
                        <Link href="/etl">ETL</Link>
                    </li>
                </ul>
               
            </nav>
        </div>
    </div>
}
