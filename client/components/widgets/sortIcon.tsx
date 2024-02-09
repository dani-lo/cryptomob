import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCaretDown,
  faCaretUp
} from "@fortawesome/free-solid-svg-icons"

import { SortDirection } from "@/src/helpers/sort";

export const SortIconComponent = ({ sortDir }: { sortDir: SortDirection | null}) => {

    const cname = sortDir === null ? 'disabled' : ''
    const icon = sortDir === null ? faCaretDown : sortDir === SortDirection.desc ? faCaretDown : faCaretUp
        

    return <FontAwesomeIcon
        className={ cname }
        icon={ icon }
    />
}