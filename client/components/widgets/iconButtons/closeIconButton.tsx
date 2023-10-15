import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { cnBigIconDark, utils } from "@/src/styles/classnames.tailwind"

export const CloseIconButtonComponent = ({
    onClose
}: { onClose: () => void}) => {

    return <FontAwesomeIcon
        icon={ faTimes }
        className={ utils.cnJoin([cnBigIconDark, 'clickable-icon'])}
        onClick={ onClose }
    />
}