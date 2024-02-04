import { useWindowSize } from "@/src/hooks/useSize"
import { useState } from "react"

type ThreePanelPos = 'left' | 'mid' | 'right'

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

    if (curr === 'right') {
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

const ThreepanelNav = ({ pos, next, prev }: { pos: ThreePanelPos, next?: () => void, prev?: () => void}) => {
    return <div>
        {
            ['right', 'mid'].includes(pos) ?
                <button onClick={ () => prev ? prev() : undefined}>prev</button>:
                null
        }
        {
            ['left', 'mid'].includes(pos) ?
                <button onClick={ () => next ? next() : undefined}>next</button>:
                null
        }
    </div>
}

export const ThreePanel = ({ children }: any) => {

    const sizeR = useWindowSize()

    const size = { width: sizeR.width  }
    const [panel, setPanel] = useState<ThreePanelPos>('right')

    const mainStyle= panelStyle(size.width, panel)

    return <div style={ mainStyle } className="three-panel qrated-ctn">
        <div style={{ background: 'red', ...(subPanelStyle(size.width, 'left')) }}>
            <ThreepanelNav pos='left' next={ () => setPanel('mid')} />
            
            {
                children[0]
            }
        </div>
        <div style={{ background: 'yellow', ...(subPanelStyle(size.width, 'mid')) }}>
            <ThreepanelNav pos='mid' next={ () => setPanel('right')} prev={ () => setPanel('left')} />
            {
                children[1]
            }
        </div>
        <div style={{ background: 'green', ...(subPanelStyle(size.width, 'right')) }}>
            <ThreepanelNav pos='right' prev={ () => setPanel('mid')} />
            {
                children[2]
            }
        </div>
    </div>
}