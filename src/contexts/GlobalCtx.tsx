import React, { createContext, useState } from 'react'

interface stateCtx {
    isNavExpanded: boolean
    toggleIsNavExpanded: Function
}

const initialState: stateCtx = {
    isNavExpanded: false,
    toggleIsNavExpanded: () => {},
}
export const GlobalCtx = createContext<stateCtx>(initialState);

interface Props {
    children: any
}

function GlobalProvider(props: Props) {
    const {children} = props

    const [isNavExpanded, setIsNavExpanded] = useState<boolean>(false);

    const toggleIsNavExpanded = () => {
        setIsNavExpanded(!isNavExpanded);
    }
    return (
        <GlobalCtx.Provider value={{
            isNavExpanded, toggleIsNavExpanded
        }}>
            {children}
        </GlobalCtx.Provider>    
    )
    
}
    
export default GlobalProvider
