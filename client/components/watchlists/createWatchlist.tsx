import { FormEvent, useState } from "react"


import { useAddWatchlist } from "@/src/hooks/useWatchlist"

import * as cnames from "@/src/styles/classnames.tailwind"
import { getAppStaticSettings } from "@/src/store/static"

export const CreateWatchlistComponent = () => {

    const [text, setText] = useState('')

    const appId = getAppStaticSettings().appId

    const addWatchlistMutation =  useAddWatchlist()

    const handleSubmit = (e: FormEvent) => {
        
        e.preventDefault()

        addWatchlistMutation.mutate({
            watchlist_name: text,
            user_id: 1,
            app_id: appId
        })

        setText('')
    }

    const disabled = text === ''

    return <div className="flex items-center" style={{ overflowY: 'scroll' }}>
        <div style={{ flex: 1, padding: '1rem' }}>
            <input
                name="postContent"
                value={ text }
                className={ cnames.utils.cnFullW(cnames.cnInputText) }                
                onChange={(e) => setText(e.target.value)}
            />
        </div>
        <div style={{ flex: 1, padding: '1rem 1rem 1rem  0' }}>
            <button 
                className={ disabled ? cnames.utils.disabled(cnames.cnButton) :  cnames.cnButton }
                onClick={ handleSubmit }
            >Add watchlist</button>
        </div>
    </div>
}