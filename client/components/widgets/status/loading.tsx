import { AppStaticSettings } from '@/src/store/static'
import { cnBold, cnSectionSmallTitle, utils } from '@/src/styles/classnames.tailwind'

export const LoadingComponent = ({appStaticSettings}: { appStaticSettings : AppStaticSettings }) => {
    return <div style={{ position: 'absolute', zIndex: '100', width: '100%' }} >
    <p className={ utils.cnJoin([appStaticSettings.txtClear, appStaticSettings.bgEvidence, cnSectionSmallTitle, cnBold, 'text-center', 'm-5', 'p-4']) }>Loading... on initial request</p>
  </div>
}