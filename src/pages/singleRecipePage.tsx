import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WP_REST_API_Attachment, WP_REST_API_Post } from 'wp-types';
import PageContentColumns from '../components/PageContentColumns';
import { CacheCtx } from '../contexts/CacheCtx';
import styles from 'src/styles/pageContent.module.scss';
import WPParsedContent from '../components/WPParsedContent';

interface Props {};



function SingleRecipePage(props: Props) {
    const {} = props;

    const params = useParams();
    const cacheContext = useContext(CacheCtx);

    const [featuredImgData, setFeaturedImgData] = useState<imgData | null>(null);
    const [renderedContent, setRenderedContent] = useState<string>('');
    const [title, setTitle] = useState<string | null>(null);
    
    const { runFetch: mediaFetcher, isLoading: isMediaFetchLoading, data: mediaData} = cacheContext.wpMediaFetcher as FetchObject<WP_REST_API_Attachment>;
    const { runFetch: recipeFetcher, isLoading: isRecipeFetchLoading, data: recipeData} = cacheContext.wpRecipeFetcher as FetchObject<WP_REST_API_Post>;

    useEffect(() => {
        mediaFetcher();
    }, []);

    useEffect(() => {
        const queryOptions: Partial<FetchOptions> = {
            shouldCache: false,
            appendFields: ['content'],
            slugs: [`${params.slug}`]
        };
        recipeFetcher(queryOptions);
    }, []);

    useEffect(() => {
        if(!recipeData[0]) return;
        if(recipeData[0].content) setRenderedContent(recipeData[0].content.rendered);
        if(recipeData[0].title !== undefined) setTitle(() => {
            if(recipeData[0].title?.rendered === "") return null;
            return recipeData[0].title?.rendered as string;
        });
    }, [recipeData]);

    const recipeContent = useMemo(() => {
        if(!!!renderedContent.length) return <h1>Could not retrieve recipe data from the server</h1>;
        return <WPParsedContent data={renderedContent} />;
    }, [renderedContent]);

    useEffect(() => {
        const typeSafeMediaData = mediaData as Partial<WP_REST_API_Attachment>[];
        const typeSafeRecipeData = recipeData as Partial<WP_REST_API_Post>[];
        if(!typeSafeMediaData.length || !recipeData.length) return;
        const imgObj = typeSafeMediaData.find(obj => obj.id === typeSafeRecipeData[0].featured_media);
        if(imgObj === undefined) return;
        const imgSrc = ((imgObj?.media_details as unknown) as WPTH_REST_Img_Media_Details).sizes.full.source_url;
        const imgAlt = imgObj.alt_text as string;
        setFeaturedImgData({src: imgSrc, alt: imgAlt});
    }, [mediaData, recipeData]);

    const image = useMemo(() => {
        if(featuredImgData === null) return<h1>no image</h1>;
        return <img src={featuredImgData.src} alt={featuredImgData.alt} className={styles.featuredImg} />
    }, [featuredImgData]);
    
    return (
        <PageContentColumns title={ title as string}>
            {image}
            {recipeContent}
        </PageContentColumns>
    );
};

export default SingleRecipePage;
