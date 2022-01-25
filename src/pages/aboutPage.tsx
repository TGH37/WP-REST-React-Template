import React, { useContext, useEffect, useMemo } from 'react';
import PageContentColumns from '../components/PageContentColumns';
import HeroBannerImg1500 from 'src/assets/imgs/hero-banner-1500.jpg';
import { CacheCtx } from '../contexts/CacheCtx';
import { WP_REST_API_Post } from 'wp-types';
import WPParsedContent from '../components/WPParsedContent';
import parse from 'html-react-parser'

interface Props {};

function AboutPage(props: Props) {
    const {} = props;

    const cacheContext = useContext(CacheCtx);

    const { runFetch: pageFetcher, isLoading: isPageFetchLoading, data: pageData} = cacheContext.wpPageFetcher as FetchObject<WP_REST_API_Post>;

    useEffect(() => {
        const queryOptions: Partial<FetchOptions> = {
            shouldCache: false,
            slugs: ['about'],
        };
        pageFetcher(queryOptions);
    }, []);

    const pageContent = useMemo(() => {
        if(!pageData.length) return <></>;
        const content = pageData[0].content?.rendered as string;
        return <WPParsedContent data={content} />;
    }, [pageData]);
    
    return (
        <PageContentColumns title={"about"}>
            <img src={HeroBannerImg1500} alt="" />
            {isPageFetchLoading ? <p>loading...</p> : pageContent}
        </PageContentColumns>
    );
};

export default AboutPage;
