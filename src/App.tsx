import React from 'react';
import 'src/styles/global.scss';
import Homepage from './pages/homePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSearch, faCheck } from '@fortawesome/free-solid-svg-icons'

import BreakpointProvider from './contexts/MediaBreakpointCtx';
import GlobalProvider from './contexts/GlobalCtx';
import AboutPage from './pages/aboutPage';
import ContactPage from './pages/contactPage';
import BlogPage from './pages/blogPage';
import Layout from './components/Layout';
import RecipesPage from './pages/recipesPage';
import SingleRecipePage from './pages/singleRecipePage';
import SingleBlogPostPage from './pages/singleBlogPostPage';
import CacheProvider from './contexts/CacheCtx';

library.add(fab, faSearch, faCheck)

const App = () => {
    return(
        <BrowserRouter>
            <GlobalProvider> 
                <BreakpointProvider>
                    <CacheProvider>
                        <Layout >
                            <Routes >
                                <Route path={"/"} element={<Homepage />}/>
                                <Route path={"/recipes"} element={<RecipesPage />}/>
                                <Route path={"/recipes/:slug"} element={<SingleRecipePage />}/>
                                <Route path={"/about"} element={<AboutPage />}/>
                                <Route path={"/blog"} element={<BlogPage />}/>
                                <Route path={"/blog/:slug"} element={<SingleBlogPostPage />}/>
                                <Route path={"/contact"} element={<ContactPage />}/>
                            </Routes>
                        </Layout>
                    </CacheProvider>
                </BreakpointProvider>
            </GlobalProvider>
        </BrowserRouter>
    );
};

export default App;