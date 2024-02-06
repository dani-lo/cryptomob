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
  faLaptopCode
} from "@fortawesome/free-solid-svg-icons"

// import { cnLogo, cnLogoContainer } from "@/src/styles/classnames.tailwind"
import { usePathname } from 'next/navigation';
// import { useAtom } from 'jotai';
import { getAppStaticSettings } from '@/src/store/static';
import { cnParagraph, utils } from '@/src/styles/classnames.tailwind';
import { currPanelAtom } from '@/src/store/uiAtoms';
import { useAtom } from 'jotai';

// import { LoginButtonComponent } from './widgets/account/loginButton';

const cname = (isActive: boolean, activeCname: string) => {

    if (isActive) {
      return 'text-sm py-4 ' + activeCname
    }
    return 'text-white text-sm py-4'
}

export const HeaderComponent = ()  => {
    
    const pathname = usePathname()
    const [, setPanel] = useAtom(currPanelAtom)
    
    const appStaticSettings = getAppStaticSettings()
    const appId = appStaticSettings.appId
    
    return <div className={ `${ appStaticSettings.bg } navbar pt-8` }>
        
        <div>
            <h1 className={ appStaticSettings.txtEvidence }>
                {/* <FontAwesomeIcon icon={faQ} /> */}
                {/* <span>rated</span> */}
                { appStaticSettings.appName }
            </h1>
            <h4>A Q-Rated list</h4>
            <div className="logo-container ">
                <ul className="">
                    <li  className={ utils.cnJoin([
                            appId === 1 ? appStaticSettings.txtEvidence : appStaticSettings.txtClear, 
                            appId === 1 ?  ' active py-3 ' : ' py-3 '
                        ]) } >
                        
                        <p className={ utils.cnJoin([cnParagraph, appId === 1 ? appStaticSettings.txtEvidence : appStaticSettings.txtClear]) }>
                            <FontAwesomeIcon icon={faLaptopCode} />
                            <a  className={ appId === 1 ? appStaticSettings.txtEvidence : appStaticSettings.txtClear }>yogabhavana</a>
                        </p>
                        <p className={ cnParagraph }>Q-Rated list of articles on yoga practice and philosophy (including Buddhist and Kashmiri Shaiva resources)</p>
                    </li>
                    <li  className={ utils.cnJoin([
                            appId === 2 ? appStaticSettings.txtEvidence : appStaticSettings.txtClear, 
                            appId === 2 ?  ' active py-3 ' : ' py-3 '
                        ]) } >
                        <p className={ utils.cnJoin([cnParagraph, appId === 2 ? appStaticSettings.txtEvidence : appStaticSettings.txtClear]) }>
                            <FontAwesomeIcon className={ appId === 2 ? appStaticSettings.txtEvidence : appStaticSettings.txtClear } icon={faLaptopCode} />
                            <a  className={ appId === 2 ? appStaticSettings.txtEvidence : appStaticSettings.txtClear }>fullstacked</a>
                        </p>
                        <p className={ cnParagraph }>Q-Rated list of articles on programming and computer science</p>
                    </li>
                       
                </ul>
            </div>
            <nav>
                <ul className=" px-2">
                    <li  className={ cname(pathname.indexOf('articles') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faNewspaper} />
                        <Link href="/articles" onClick={() => { setPanel('mid') }}>Articles</Link>
                    </li>
                    <li className="separate"><span /></li>
                    <li  className={ cname(pathname.indexOf('tags') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faTags} />
                        <Link href="/tags" onClick={() => { setPanel('mid') }}>Tags</Link>
                    </li>
                    <li  className={ cname(pathname.indexOf('categories') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faClone} />
                        <Link href="/categories" onClick={() => { setPanel('mid') }}>Categories</Link>
                    </li>
                    <li  className={ cname(pathname.indexOf('authors') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faUserTie} />
                        <Link href="/authors" onClick={() => { setPanel('mid') }}>Authors</Link>
                    </li>
                    <li  className={ cname(pathname.indexOf('watchlists') !== -1, appStaticSettings.txtEvidence) }>
                        <FontAwesomeIcon icon={faBinoculars} />
                        <Link href="/watchlists" onClick={() => { setPanel('mid') }}>WatchLists</Link>
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
                        <Link href="/etl" onClick={() => { setPanel('mid') }}>ETL</Link>
                    </li>
                </ul>
               
            </nav>
        </div>
    </div>
}
