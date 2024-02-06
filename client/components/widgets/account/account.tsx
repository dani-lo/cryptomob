import { Dispatch, useCallback, useState } from "react"

import { useLocalStorage } from "@/src/hooks/useStorage"
import { StyledContainedBar } from "@/src/styles/main.styled"
import { CloseIconButtonComponent } from "../iconButtons/closeIconButton"
import { IconTitleComponent } from "../iconed"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { submitLogin } from "@/src/queries/userQueries"
import { cnButton, cnInputBlock, cnInputLabel, cnInputText, cnParagraph, cnSectionTitle, utils } from "@/src/styles/classnames.tailwind"
import { SetStateAction } from "jotai"
import { getAppStaticSettings } from "@/src/store/static"

interface StoredUser {
    user_email: string | null,
    user_id: number | null,
    token: string | null
}

const defaultJwtStorage: StoredUser = {
    user_email: null,
    user_id: null,
    token: null
}

export const AccountComponent = ({ onClose }: { onClose: () => void}) => {

    const [userwithtok, setUserwithtok] = useLocalStorage<StoredUser>('user', defaultJwtStorage) as [StoredUser, Dispatch<SetStateAction<StoredUser>>]

    const [u, setU] = useState('')
    const [p, setP] = useState('')

    const disabled = !u || !p

    const loginUser = useCallback(async () => {

        const user = await submitLogin(u,p)  as StoredUser
                                            
        setP('')
        setU('')

        setUserwithtok(user)
        
    }, [p, u, setUserwithtok])
    
    const { bg } = getAppStaticSettings()

    const isValidUser = !!userwithtok.user_id && !!userwithtok.user_email && !!userwithtok.token

    return <div className="overlay-full p-4 bg-white" style={{ overflowY: 'scroll' }}>
        <div className="overlay-small-content rounded-lg shadow">
            <StyledContainedBar>
                <CloseIconButtonComponent onClose={ onClose } />
            </StyledContainedBar>
            <IconTitleComponent
                text="Your account"
                icon={ faUser }
                bgColor={ bg }
            />
            <div style={{ height: '100%' }} className="user-account-data">
                {
                    !isValidUser ? 
                        <div>
                            <h3 className={ cnSectionTitle }>Login</h3>
                            <div>
                                <div className={ cnInputBlock }>
                                    <label className={ cnInputLabel }>email</label>
                                    <input
                                        value={ u }
                                        type="text"
                                        className={ cnInputText }
                                        onChange={ (v) => setU(v.target.value)}
                                    />
                                </div>
                                <div className={ cnInputBlock }>
                                    <label className={ cnInputLabel }>password</label>
                                    <input
                                        value={ p }
                                        type="text"
                                        className={ cnInputText }
                                        onChange={ (v) => setP(v.target.value)}
                                    />
                                </div>
                                <div className="my-4">
                                    <button 
                                        className={ utils.cnJoin([cnButton, disabled ? 'disabled' : '']) }
                                        onClick={ loginUser }
                                    >
                                        login
                                    </button>
                                </div>
                            </div>
                            {/* <h3>Register</h3> */}
                        </div>
                    : 
                    <div>
                        <h3 className={ utils.cnJoin([cnSectionTitle, 'pt-4']) }>You are logged in as</h3>
                        <p className={ cnParagraph }>{ userwithtok.user_email }</p>
                    </div>
                }
            </div>
        </div>
    </div>
}