import { FormEvent, useState } from "react"

import { useAddtag } from "@/src/hooks/useTags"

import * as cnames from "@/src/styles/classnames.tailwind"

export const CreateTagComponent = () => {

    const [text, setText] = useState('')

    const addTagMutation =  useAddtag()

    const handleSubmit = (e: FormEvent) => {
        
        e.preventDefault()

        addTagMutation.mutate({
            tag_name: text,
            tag_origin: 'user'
        })

        setText('')
    }

    const disabled = text === ''

    return <div className="flex items-center" style={{ overflowY: 'scroll' }}>
        <div style={{ flex: 1, padding: '1rem 1rem 1rem 0' }}>
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
                >Add tag</button>
            </div>
    </div>
}