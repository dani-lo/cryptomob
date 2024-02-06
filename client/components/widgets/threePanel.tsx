'use client'

import { useAtom } from "jotai"

// import { useWindowSize } from "@/src/hooks/useSize"

// import { AppStaticSettings, getAppStaticSettings } from "@/src/store/static"
import { ThreePanelPos, currPanelAtom } from "@/src/store/uiAtoms"
import { AccountComponent } from "./account/account"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

// import { cnThreePanel, utils } from "@/src/styles/classnames.tailwind"


const panelStyle = (winW: number, curr: ThreePanelPos) => {
    if (curr === 'left') {
        return {
            left: 0,
            width: (winW * 3) + 'px'
        }
    }

    if (curr === 'mid') {
        return {
            left: '-' + winW + 'px',
            width: (winW * 3) + 'px'
        }
    }

    if (curr === 'right' || curr === 'user') {
        return {
            left:  '-' + (winW * 2) + 'px',
            width: (winW * 3) + 'px'
        }
    }
}

const subPanelStyle = (winW: number, pos: ThreePanelPos) => {
        return {
            width: (winW) + 'px',
            left: pos === 'left' ? 0 : pos === 'mid' ? winW + 'px' : (winW * 2) + 'px'
        }
    
}

// const ThreepanelNav = ({ pos, next, prev, appStaticSettings }: { 
//         pos: ThreePanelPos, 
//         next?: () => void, 
//         prev?: () => void, 
//         appStaticSettings: AppStaticSettings}) => {
    
//     const threePanelStylesCnames = cnThreePanel(appStaticSettings)

//     return <div className={ threePanelStylesCnames.nav }>
//         {
//             ['right', 'mid'].includes(pos) ?
//                 <button onClick={ () => prev ? prev() : undefined}>prev</button>:
//                 null
//         }
//         {
//             ['left', 'mid'].includes(pos) ?
//                 <button onClick={ () => next ? next() : undefined}>next</button>:
//                 null
//         }
//     </div>
// }

export const ThreePanel = ({ children }: any) => {
 
    // const appStaticSettings = getAppStaticSettings()

    const elemRef = useRef<HTMLDivElement>(null)
    const [w, setW] = useState(0)

    // const size = useWindowSize()

    // console.log(size)
    // console.log(window)
    const [panel, setPanel] = useAtom(currPanelAtom)

    // const w = ff // size?.width || 0

    const mainStyle= panelStyle(w, panel)

    
    // useEffect(() => {
    //     setW(window.innerWidth)
    // }, [])

    useLayoutEffect(() => {

        function updateSize() {
          setW(window.innerWidth);
        }

        window.addEventListener('resize', updateSize)

        updateSize()

        return () => window.removeEventListener('resize', updateSize)
      }, []);

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.scrollTo(0,0) 
        }
    }, [panel])

    if (w === 0) {
        return null
    }

    return <div style={ mainStyle } className="three-panel" ref={ elemRef }>
        <div style={{ ...(subPanelStyle(w, 'left')) }}>
            {/* <ThreepanelNav 
                pos='left' 
                next={ () => setPanel('mid')} 
                appStaticSettings={ appStaticSettings }
            /> */}
            
            {
                children[0]
            }
        </div>
        <div style={{ ...(subPanelStyle(w, 'mid')) }}>
            {/* <ThreepanelNav 
                pos='mid' next={ () => setPanel('right')} 
                prev={ () => setPanel('left')} 
                appStaticSettings={ appStaticSettings }
            /> */}
            {
                children[1]
            }
        </div>
        <div style={{ ...(subPanelStyle(w, 'right')) }}>
            {/* <ThreepanelNav 
                pos='right' 
                prev={ () => setPanel('mid')} 
                appStaticSettings={ appStaticSettings }
            /> */}
            {
                panel === 'user' ?  
                <AccountComponent onClose={ () => setPanel('mid')} /> : 
                children[2]
            }
        </div>
    </div>
}