'use client'

import { getAppStaticSettings } from "@/src/store/static"
import { cnBigIcon, utils } from "@/src/styles/classnames.tailwind"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { AccountComponent } from "./account"

export const LoginButtonComponent = () => {

    const [userUi, setUserUi] = useState(false)
    const staticAppSettings = getAppStaticSettings()

    return <div style={{ position: 'fixed', zIndex: 'var(--z-1)' }}> 
        {
            userUi ? <AccountComponent onClose={ () => setUserUi(v => !v) } /> : null
        }
        <FontAwesomeIcon
            icon={ faUser }
            className={ utils.cnJoin([cnBigIcon(staticAppSettings.txtClear), 'clickable-icon', 'mt-4 ml-2'])}
            onClick={ () => setUserUi(v => !v) }
        />
    </div>
}