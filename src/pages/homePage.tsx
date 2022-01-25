import React, { useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { WP_REST_API_Post } from 'wp-types';
import ColumnisedSection from '../components/ColumnisedSection';
import Hero from '../components/Hero';
import ModulatedContent from '../components/ModulatedContent';
import WPParsedContent from '../components/WPParsedContent';
import { CacheCtx } from '../contexts/CacheCtx';

interface Props {}

function Homepage(props: Props) {
    const {} = props

    const cacheContext = useContext(CacheCtx);

    const { runFetch: postFetcher, isLoading: isPostFetchLoading, data: postData} = cacheContext.wpPostFetcher as FetchObject<WP_REST_API_Post>;
    const { runFetch: pageFetcher, isLoading: isPageFetchLoading, data: pageData} = cacheContext.wpPageFetcher as FetchObject<WP_REST_API_Post>;

    useEffect(() => {
        const queryOptions: Partial<FetchOptions> = {
            appendFields: ['content'],
            shouldCache: false,
            sticky: true,
        };
        postFetcher(queryOptions);
    }, []);

    useEffect(() => {
        const queryOptions: Partial<FetchOptions> = {
            shouldCache: false,
            slugs: ['home'],
        };
        pageFetcher(queryOptions);
    }, []);

    const posts = useMemo(() => {
        if(!postData.length) return <></>;
        return <ColumnisedSection   render={() =>   <>
                                                        <ModulatedContent data={postData} />
                                                        <Link to={'blog'} >Read More</Link>
                                                    </>} 
                                    title='Latest Posts' 
                />;
    }, [postData]);

    const pageContent = useMemo(() => {
        if(!pageData.length) return <></>;
        const content = pageData[0].content?.rendered as string;
        return <WPParsedContent data={content} />;
    }, [pageData]);

    return (
        <>
            <Hero />
            {posts}
            {pageContent}
        </>
    );
};


export default Homepage;
