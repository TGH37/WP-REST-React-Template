import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import React, { createContext, useState } from 'react';

interface stateCtx {
    isNavExpanded: boolean
    toggleIsNavExpanded: Function
    socialMediaObjects: SocialMediaObject[] 
};

const initialState: stateCtx = {
    isNavExpanded: false,
    toggleIsNavExpanded: () => {},
    socialMediaObjects: [
        {handle: "github", link: "https://github.com/TGH37", icon: faGithub},
        {handle: "linkedin", link: "https://www.linkedin.com/in/tgh37", icon: faLinkedin},
    ],
};

export const GlobalCtx = createContext<stateCtx>(initialState);

interface Props {
    children: any
};

function GlobalProvider(props: Props) {
    const {children} = props;
    const { socialMediaObjects } = initialState;

    const [isNavExpanded, setIsNavExpanded] = useState<boolean>(false);

    const toggleIsNavExpanded = () => {
        setIsNavExpanded(!isNavExpanded);
    };

    return (
        <GlobalCtx.Provider value={{
            isNavExpanded, toggleIsNavExpanded,
            socialMediaObjects
        }}>
            {children}
        </GlobalCtx.Provider>    
    );
};
    
export default GlobalProvider;
