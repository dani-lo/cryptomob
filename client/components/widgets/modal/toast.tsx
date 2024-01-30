'use client'

import { toastAtom } from "@/src/store/userAtoms"
import { cnParagraphBase, cnWarn, utils } from "@/src/styles/classnames.tailwind"
import { faCheck, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAtom } from "jotai"

export type ToastLevel = 'err' | 'ok' | 'warn'

export const ToastComponent = () => {

    const [toast] = useAtom(toastAtom)

    const icon = toast?.level === 'ok' ? faCheck : faExclamationTriangle
    const levelCname = cnWarn

    return <div className={ toast?.show ? 'toast active' : 'toast' }>
        <p className={ utils.cnJoin([levelCname, cnParagraphBase]) }>
            <FontAwesomeIcon
                icon={ icon }
            />
            <span className="pl-2">{ toast?.text || null }</span></p>
    </div>

}