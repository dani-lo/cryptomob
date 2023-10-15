import {  useState } from "react"

import * as cnames from "@/src/styles/classnames.tailwind"
import { useAddCategory } from "@/src/hooks/useCategories"

export const CreateCategoryComponent = () => {

    const [text, setText] = useState('')

    const addCategoryMutation =  useAddCategory()

    const handleSubmit = () => {
        
        addCategoryMutation.mutate({
            category_name: text,
            user_id: 1,
        })

        setText('')
    }

    const disabled = text === ''

    return <div className="flex items-center" style={{ overflowY: 'scroll' }}>
        {/* <StyledContainedBar>
            <CloseIconButtonComponent onClose={ onClose } />
        </StyledContainedBar> */}
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
                >Add category</button>
            </div>
    </div>
}