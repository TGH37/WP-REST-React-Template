import React, { useContext, useEffect, useMemo } from 'react';
import PageContentColumns from '../components/PageContentColumns';
import HeroBannerImg1500 from 'src/assets/imgs/hero-banner-1500.jpg';
import { WP_REST_API_Post } from 'wp-types';
import WPParsedContent from '../components/WPParsedContent';
import {CacheCtx} from '../contexts/CacheCtx';
import SocialMedia from '../components/SocialMedia';
import ColumnisedSection from '../components/ColumnisedSection';

interface Props {};

function ContactPage(props: Props) {
    const {} = props;

    const cacheContext = useContext(CacheCtx);

    const { runFetch: pageFetcher, isLoading: isPageFetchLoading, data: pageData} = cacheContext.wpPageFetcher as FetchObject<WP_REST_API_Post>;

    useEffect(() => {
        const queryOptions: Partial<FetchOptions> = {
            shouldCache: false,
            slugs: ['contact'],
        };
        pageFetcher(queryOptions);
    }, []);

    const pageContent = useMemo(() => {
        if(!pageData.length) return <></>;
        const content = pageData[0].content?.rendered as string;
        return <WPParsedContent data={content} />;
    }, [pageData, pageFetcher]);
    
    return (
        <PageContentColumns title={"get in touch"}>
            <img src={HeroBannerImg1500} alt="" />
            {isPageFetchLoading ? <p>loading...</p> : pageContent}
            <ColumnisedSection title="" render={() => <SocialMedia iconSize='2x'/>} />
        </PageContentColumns>
    );
};

export default ContactPage;
