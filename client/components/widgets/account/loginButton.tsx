'use client'

import { useAtom } from 'jotai';
import { currPanelAtom } from '@/src/store/uiAtoms';

import { getAppStaticSettings } from "@/src/store/static"
import { cnBigIcon, utils, cnLoginContainer } from "@/src/styles/classnames.tailwind"
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
// import { AccountComponent } from "./account"

export const LoginButtonComponent = () => {

    const [, setUserUi] = useState(false)

    const [panel, setPanel] = useAtom(currPanelAtom)

    const staticAppSettings = getAppStaticSettings()

    return panel === 'mid' ? <div className={ cnLoginContainer }> 

        <FontAwesomeIcon
            icon={ faBars }
            className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon moby', 'mt-4 mr-2'])}
            onClick={ () => {
                setUserUi(v => !v) 
                setPanel('left')
            }}
        />

        <FontAwesomeIcon
            icon={ faUser }
            className={ utils.cnJoin([cnBigIcon(staticAppSettings.txt), 'clickable-icon login-icon', 'mt-4 ml-2'])}
            onClick={ () => {
                setUserUi(v => !v) 
                setPanel('user')
            }}
        />
        
    </div> : null
}