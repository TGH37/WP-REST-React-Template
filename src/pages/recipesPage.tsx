import React, { useContext, useEffect, useMemo, useState } from 'react';
import PageContentColumns from '../components/PageContentColumns';
import BlogPreviewItem from '../components/BlogPreviewItem';
import { Link, useRouteMatch } from 'react-router-dom';
import { CacheCtx } from '../contexts/CacheCtx';
import { WP_REST_API_Attachment, WP_REST_API_Post } from 'wp-types';
import useCache from '../hooks/useCache';
import styles from 'src/styles/blog.module.scss';

interface Props {};

function RecipesPage(props: Props) {
    const {} = props;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { url } = useRouteMatch();

    const cacheCtx = useContext(CacheCtx);

    const { recipesCache, mediaCache} = cacheCtx.cacheItems;
    const { rootDataQueries, mediaDataQueries, rootDataFetchFields, mediaDataFetchFields,} = cacheCtx.defaultQueries;


    const [ wpAllData, isPostCacheLoading ] = useCache<WP_REST_API_Post>({url: recipesCache.url, watchFields: rootDataQueries, cacheFields: rootDataFetchFields, cacheKey: recipesCache.accessor});
    const [ wpMediaData, isMediaCacheLoading ] = useCache<WP_REST_API_Attachment>({url: mediaCache.url, watchFields: mediaDataQueries, cacheFields: mediaDataFetchFields, cacheKey: mediaCache.accessor});

    const blogPosts = useMemo(() => {
        if(!wpAllData || !wpMediaData) return;
        const blogPostArry = (wpAllData as WP_REST_API_Post[]).map((post: any) => {
            const { id, featured_media, slug}: ExctractedData = post;
            const postMediaArry = featured_media === 0 ? [] : (wpMediaData as WP_REST_API_Attachment[]).flatMap((mediaItem: any) => mediaItem.id === featured_media ? [mediaItem] : []);
            
            return (
                <Link to={`${url}/${slug}`} className={styles.previewCardContainer} key={`blog_post_prev_id:${id}`}>
                    <BlogPreviewItem postMedia={postMediaArry} postData={post}/>
                </Link>
            );
        });
        return blogPostArry;
    }, [wpAllData, wpMediaData]);
    
    return (
        <>
            <PageContentColumns title={"recipes"}>
                <>
                    {blogPosts}
                    {/* <BlogPreviewItem /> */}
                    {/* <p>{wpData}</p> */}
                </>
            </PageContentColumns>
        </>
    );
};

export default RecipesPage;
