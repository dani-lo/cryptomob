import { cnModalTitle } from "@/src/styles/classnames.tailwind"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const IconTitleComponent = ({ text, icon, link, bgColor }: { text: string; icon: IconDefinition; bgColor: string; link ?: string;}) => {

    return <h4 className={ cnModalTitle(bgColor) } style={{ textAlign: 'left'}}>
        <FontAwesomeIcon icon={icon} className="pl-2 pr-4" />
        {  link ? <a href={ link }>{ text }</a> : text }
    </h4>
}