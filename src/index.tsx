import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Layout from './components/Layout';
import NoMatch from './components/NoMatch';
import GlobalProvider from './contexts/GlobalCtx';
import BreakpointProvider from './contexts/MediaBreakpointCtx';
import AboutPage from './pages/aboutPage';
import BlogPage from './pages/blogPage';
import ContactPage from './pages/contactPage';
import Homepage from './pages/homePage';
import RecipesPage from './pages/recipesPage';
import ResourcesPage from './pages/resourcesPage';
import SingleBlogPostPage from './pages/singleBlogPostPage';
import SingleRecipePage from './pages/singleRecipePage';


ReactDOM.render(
<BrowserRouter>
    <Routes >
        <Route path="/" element={<App />}>
            <Route index element={<Homepage />}/>
            <Route path="about" element={<AboutPage />}/>
            <Route path="resources" element={<ResourcesPage />}/>
            <Route path="contact" element={<ContactPage />}/>
            <Route path="recipes" element={<RecipesPage />}>
                <Route path=":slug" element={<SingleRecipePage />} />
            </Route>
            <Route path="blog" element={<BlogPage />}/>
            <Route path="blog/:slug" element={<SingleBlogPostPage />} />
            <Route path="*" element={<NoMatch />} />
        </Route>
    </Routes>
</BrowserRouter>
, document.querySelector("#root"));