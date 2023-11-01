import { cnSectionTitle } from "@/src/styles/classnames.tailwind"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const IconTitleComponent = ({ text, icon, link }: { text: string; icon: IconDefinition; link ?: string;}) => {
    return <h5 className={ cnSectionTitle }>
        <FontAwesomeIcon icon={icon} className="pr-4" />
        {  link ? <a href={ link }>{ text }</a> : text }
    </h5>
}