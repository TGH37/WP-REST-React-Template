import React from 'react';
import 'src/styles/global.scss';
import Homepage from './pages/index';
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSearch, faCheck } from '@fortawesome/free-solid-svg-icons'

import BreakpointProvider from './contexts/MediaBreakpointCtx';
import GlobalProvider from './contexts/GlobalCtx';

library.add(fab, faSearch, faCheck)

const App = () => {
    return(
        <BrowserRouter>
            <GlobalProvider> 
                <BreakpointProvider>
                    <Homepage />
                </BreakpointProvider>
            </GlobalProvider>
        </BrowserRouter>
    );
};

export default App;