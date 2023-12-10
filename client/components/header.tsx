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
  faQ,
  faLaptopCode
} from "@fortawesome/free-solid-svg-icons"

// import { cnLogo, cnLogoContainer } from "@/src/styles/classnames.tailwind"
import { usePathname } from 'next/navigation';
// import { currSettingAtom } from '@/src/store/settingAtoms';
// import { useAtom } from 'jotai';
import { getAppStaticSettings } from '@/src/store/static';
import { cnPostscriptum, utils } from '@/src/styles/classnames.tailwind';

const cname = (isActive: boolean, activeCname: string) => {

    if (isActive) {
      return 'text-sm py-4 ' + activeCname
    }
    return 'text-white text-sm py-4'
}

export const HeaderComponent = ()  => {
    
    const pathname = usePathname()

    // const [settings] = useAtom(currSettingAtom)

    const appStaticSettings = getAppStaticSettings()
    const appId = appStaticSettings.appId
    
    return <div className={ `${ appStaticSettings.bg } navbar` }>
        <div>
            <h1 className={ appStaticSettings.txtEvidence }>
                <FontAwesomeIcon icon={faQ} />
                <span>rated</span>
            </h1>
            <div className="logo-container ">
                <ul className="">
                    <li  className={ utils.cnJoin([
                            cnPostscriptum, 
                            appId === 1 ? appStaticSettings.txtEvidence : appStaticSettings.txt, 
                            appId === 1 ?  ' active py-1 ' : ' py-2 '
                        ]) } >
                        <FontAwesomeIcon icon={faLaptopCode} />
                        <a href="#">cryptomob</a>
                    </li>
                    <li  className={ utils.cnJoin([
                            cnPostscriptum, 
                            appId === 2 ? appStaticSettings.txtEvidence : appStaticSettings.txt, 
                            appId === 2 ?  ' active py-1 ' : ' py-2 '
                        ]) } >
                         <FontAwesomeIcon icon={faLaptopCode} />
                        <a href="#">fullstacked</a>
                    </li>
                       
                </ul>
            </div>
            <nav>
                <ul className=" px-2">
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
