import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import {  cnBigIconClear, cnBigIconDark, utils } from "@/src/styles/classnames.tailwind"
import { getAppStaticSettings } from "@/src/store/static"

export const CloseIconButtonComponent = ({
    onClose, dark
}: { onClose: () => void; dark?: boolean;}) => {

    const staticAppSettings = getAppStaticSettings()

    const cnBase = dark ? cnBigIconDark(staticAppSettings.txt) : cnBigIconClear(staticAppSettings.txt) 

    return <FontAwesomeIcon
        icon={ faTimes }
        className={ utils.cnJoin([cnBase, 'clickable-icon'])}
        onClick={ onClose }
    />
}