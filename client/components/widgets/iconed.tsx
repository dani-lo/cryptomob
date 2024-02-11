import { currPanelAtom } from "@/src/store/uiAtoms";
import { cnModalTitle } from "@/src/styles/classnames.tailwind"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import Link from "next/link";

export const IconTitleComponent = ({ 
        text, 
        icon, 
        link, 
        bgColor,
        actionLink
     }: { text: string; icon: IconDefinition; bgColor: string; link ?: string; actionLink ?: string;}) => {

    const [, setPanel] = useAtom(currPanelAtom)

    return <h4 className={ cnModalTitle(bgColor) } style={{ textAlign: 'left', display: 'flex'}}>
        <div>
        <FontAwesomeIcon icon={icon} className="pl-2 pr-4" />
            {  link ? <a href={ link }>{ text }</a> : text }
        </div>
        {
            actionLink ?
            <div className="action-link">
                <Link 
                    href={ actionLink }
                    onClick={ () => setPanel('right')}
                >
                    <FontAwesomeIcon
                        // className={ cname }
                        icon={ faPlus }
                    />
                </Link>
            </div>: null
        }
    </h4>
}