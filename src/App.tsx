import React from 'react';
import 'src/styles/global.scss';
import Homepage from './pages/homePage';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
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

library.add(fab, faSearch, faCheck)

const App = () => {
    return(
        <BrowserRouter>
            <GlobalProvider> 
                <BreakpointProvider>
                    <Layout >
                        <Switch >
                            <Route exact path={["/", "/home"]} component={Homepage}/>
                            <Route exact path={"/recipes"} component={RecipesPage}/>
                            <Route exact path={"/recipes/:slug"} component={SingleRecipePage}/>
                            <Route exact path={"/about"} component={AboutPage}/>
                            <Route exact path={"/resources"} component={ResourcesPage}/>
                            <Route exact path={"/blog"} component={BlogPage}/>
                            <Route exact path={"/blog/:slug"} component={SingleBlogPostPage}/>
                            {/* <Route exact path={"/blog/:slug"}><SingleBlogPostPage data={"Hello"}/></Route> */}
                            <Route exact path={"/contact"} component={ContactPage}/>
                        </Switch>
                    </Layout>
                </BreakpointProvider>
            </GlobalProvider>
        </BrowserRouter>
    );
};

export default App;