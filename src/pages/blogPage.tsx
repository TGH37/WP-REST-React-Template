import React, { useContext, useEffect, useMemo, useState } from 'react';
import styles from 'src/styles/blog.module.scss';
import PageContentColumns from '../components/PageContentColumns';
import BlogPreviewItem from '../components/BlogPreviewItem';
import { Outlet, Route, Routes, useMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { WP_REST_API_Post, WP_REST_API_Attachment } from 'wp-types';
import useCache from '../hooks/useCache';
import {CacheCtx} from '../contexts/CacheCtx';
import SingleRecipePage from './singleRecipePage';

interface Props {};

function BlogPage(props: Props) {
    const {} = props;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const { url } = useMatch();
    const cacheCtx = useContext(CacheCtx);

    const { blogCache, mediaCache} = cacheCtx.cacheItems;
    const { rootDataQueries, mediaDataQueries, rootDataFetchFields, mediaDataFetchFields,} = cacheCtx.defaultQueries;

    const [ wpAllData, isPostCacheLoading ] = useCache<WP_REST_API_Post>({url: blogCache.url, watchFields: rootDataQueries, cacheFields: rootDataFetchFields, cacheKey: blogCache.accessor});
    const [ wpMediaData, isMediaCacheLoading ] = useCache<WP_REST_API_Attachment>({url: mediaCache.url, watchFields: mediaDataQueries, cacheFields: mediaDataFetchFields, cacheKey: mediaCache.accessor});
    
    useEffect(() => {
        setIsLoading(isPostCacheLoading as boolean && isMediaCacheLoading as boolean);
    }, [isPostCacheLoading, isMediaCacheLoading]);
        
    const blogPosts = useMemo(() => {
        if(!wpAllData || !wpMediaData) return;
        const blogPostArry = (wpAllData as WP_REST_API_Post[]).map((post: any) => {
            const { id, featured_media, slug}: ExctractedData = post;
            const postMediaArry = featured_media === 0 ? [] : (wpMediaData as WP_REST_API_Attachment[]).flatMap((mediaItem: any) => mediaItem.id === featured_media ? [mediaItem] : []);
            
            return (
                <Link to={`${slug}`} className={styles.previewCardContainer} key={`blog_post_prev_id:${id}`}>
                    <BlogPreviewItem postMedia={postMediaArry} postData={post}/>
                </Link>
            );
        });
        return blogPostArry;
    }, [wpAllData, wpMediaData]);

    
    
    const getRenderedElements = () => {
        // console.log("page render")
            if(isLoading) return <p>Loading...</p>;
            if(!blogPosts) return <p>An error occurred</p>;
            if(!(wpAllData as WP_REST_API_Post[]).length) return <p>No blog posts found...</p>;
            return blogPosts;
        };
        
    return (
        <PageContentColumns title={"Blog"}>
            { getRenderedElements() }
            <Link to="blog-23">Blog 2</Link>
        </PageContentColumns>
    );
};

export default BlogPage;
