import { FormEvent, useState } from "react"

import * as cnames from "@/src/styles/classnames.tailwind"
import { useAddAuthor } from "@/src/hooks/useAuthors"

export const CreateAuthorComponent = ({ onAddedAuthor }: { onAddedAuthor: (authorId: number) => void }) => {

    const [text, setText] = useState('')

    const addAuthorMutation =  useAddAuthor((id: number) => {
        // 
        onAddedAuthor(id)
    })

    const handleSubmit = (e: FormEvent) => {
        
        e.preventDefault()

        addAuthorMutation.mutate({
            author_name: text,
        })

        setText('')
    }

    const disabled = text === ''

    return <div className="flex items-center mt-4" style={{ overflowY: 'scroll' }}>
            <input
                name="postContent"
                value={ text }
                className={ cnames.cnInputText + ' mr-4' }                
                onChange={(e) => setText(e.target.value)}
            />
        
                <button 
                    className={ disabled ? cnames.utils.disabled(cnames.cnButton) :  cnames.cnButton }
                    onClick={ handleSubmit }
                >Add author</button>
            </div>
 }