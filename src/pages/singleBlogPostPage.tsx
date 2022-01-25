import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WP_REST_API_Attachment, WP_REST_API_Post } from 'wp-types';
import PageContentColumns from '../components/PageContentColumns';
import WPParsedContent from '../components/WPParsedContent';
import {CacheCtx} from '../contexts/CacheCtx';
import styles from 'src/styles/pageContent.module.scss';

interface Props {
};

function SingleBlogPostPage(props: Props) {
    const params = useParams();
    const cacheContext = useContext(CacheCtx);

    const [featuredImgData, setFeaturedImgData] = useState<imgData | null>(null);
    const [renderedContent, setRenderedContent] = useState<string>('');
    const [title, setTitle] = useState<string | null>(null);
    
    const { runFetch: mediaFetcher, isLoading: isMediaFetchLoading, data: mediaData} = cacheContext.wpMediaFetcher as FetchObject<WP_REST_API_Attachment>;
    const { runFetch: postFetcher, isLoading: isPostFetchLoading, data: postData} = cacheContext.wpPostFetcher as FetchObject<WP_REST_API_Post>;

    useEffect(() => {
        mediaFetcher();
    }, []);

    useEffect(() => {
        const queryOptions: Partial<FetchOptions> = {
            shouldCache: false,
            appendFields: ['content'],
            slugs: [`${params.slug}`]
        };
        postFetcher(queryOptions);
    }, []);

    useEffect(() => {
        if(!postData[0]) return;
        if(postData[0].content) setRenderedContent(postData[0].content.rendered);
        if(postData[0].title !== undefined) setTitle(() => {
            if(postData[0].title?.rendered === "") return null;
            return postData[0].title?.rendered as string;
        });
    }, [postData]);

    const postContent = useMemo(() => {
        if(!!!renderedContent.length) return <h1>Could not retrieve recipe data from the server</h1>;
        return <WPParsedContent data={renderedContent} />;
    }, [renderedContent]);

    useEffect(() => {
        const typeSafeMediaData = mediaData as Partial<WP_REST_API_Attachment>[];
        const typeSafePostData = postData as Partial<WP_REST_API_Post>[];
        if(!typeSafeMediaData.length || !postData.length) return;
        const imgObj = typeSafeMediaData.find(obj => obj.id === typeSafePostData[0].featured_media);
        if(imgObj === undefined) return;
        const imgSrc = ((imgObj?.media_details as unknown) as WPTH_REST_Img_Media_Details).sizes.full.source_url;
        const imgAlt = imgObj.alt_text as string;
        setFeaturedImgData({src: imgSrc, alt: imgAlt});
    }, [mediaData, postData]);

    const image = useMemo(() => {
        if(featuredImgData === null) return<h1>no image</h1>;
        return <img src={featuredImgData.src} alt={featuredImgData.alt} className={styles.featuredImg} />
    }, [featuredImgData]);

    return (
        <PageContentColumns title={ title as string}>
            {image}
            {isPostFetchLoading ? <p>loading...</p> : postContent}
        </PageContentColumns>
    );
};

export default SingleBlogPostPage;
