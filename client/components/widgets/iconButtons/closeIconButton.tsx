import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { cnBigIconDark, utils } from "@/src/styles/classnames.tailwind"
import { getAppStaticSettings } from "@/src/store/static"

export const CloseIconButtonComponent = ({
    onClose
}: { onClose: () => void}) => {

    const staticAppSettings = getAppStaticSettings()

    return <FontAwesomeIcon
        icon={ faTimes }
        className={ utils.cnJoin([cnBigIconDark(staticAppSettings.txt), 'clickable-icon'])}
        onClick={ onClose }
    />
}