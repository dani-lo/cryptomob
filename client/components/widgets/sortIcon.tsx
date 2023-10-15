import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCaretDown,
  faCaretUp
} from "@fortawesome/free-solid-svg-icons"

import { SortDirection } from "@/src/helpers/sort";

export const SortIconComponent = ({ sortDir }: { sortDir: SortDirection | null}) => {

    if (sortDir === null) {
        return null
    } 

    return <FontAwesomeIcon
        icon={ sortDir === SortDirection.desc ? faCaretDown : faCaretUp }
    />
}