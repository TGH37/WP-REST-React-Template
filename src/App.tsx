import React from 'react';
import 'src/styles/global.scss';
import Homepage from './pages/index';
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSearch, faCheck } from '@fortawesome/free-solid-svg-icons'

import BreakpointProvider from './contexts/MediaBreakpointCtx';

library.add(fab, faSearch, faCheck)

const App = () => {
    const queries = {
        xs: '(min-width: 420px)',
        sm: '(min-width: 768px)',
        md: '(min-width: 1024px)',
        lg: '(min-width: 1998px)',
      };
    return(
        <BrowserRouter>
            <BreakpointProvider queries={queries} >
                <Homepage />
            </BreakpointProvider>
        </BrowserRouter>
    );
};

export default App;