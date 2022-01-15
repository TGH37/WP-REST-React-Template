import React from 'react';
import 'src/styles/global.scss';
import Homepage from './pages/homePage';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSearch, faCheck } from '@fortawesome/free-solid-svg-icons'

import BreakpointProvider from './contexts/MediaBreakpointCtx';
import GlobalProvider from './contexts/GlobalCtx';
import AboutPage from './pages/aboutPage';
import ResourcesPage from './pages/resourcesPage';
import ContactPage from './pages/contactPage';
import BlogPage from './pages/blogPage';
import Layout from './components/Layout';
import RecipesPage from './pages/recipesPage';
import SingleRecipePage from './pages/singleRecipePage';
import SingleBlogPostPage from './pages/singleBlogPostPage';
import NoMatch from './components/NoMatch';

library.add(fab, faSearch, faCheck)

const App = () => {
    return(
    <GlobalProvider> 
        <BreakpointProvider>
            <Layout >
                <Outlet />
            </Layout>
        </BreakpointProvider>
    </GlobalProvider>
    );
};

export default App;