import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { WP_REST_API_Attachment, WP_REST_API_Category, WP_REST_API_Post } from 'wp-types';
import {CacheCtx} from '../contexts/CacheCtx';
import BlogPreviewItem from './BlogPreviewItem';
import styles from 'src/styles/blog.module.scss';

interface Props {
    postFetcherProp: FetchObject<WP_REST_API_Post>
    categoryFilterArryProp?: RecipeQueryParamType[]
}

function PostArchive(props: Props) {
    const {
        postFetcherProp,
        categoryFilterArryProp = []
    } = props;

    const cacheContext = useContext(CacheCtx);
    
    const { runFetch: postFetcher, isLoading: isPostFetchLoading, data: postData} = postFetcherProp;
    const { runFetch: mediaFetcher, isLoading: isMediaFetchLoading, data: mediaData} = cacheContext.wpMediaFetcher as FetchObject<WP_REST_API_Attachment>;
    const { runFetch: categoryFetcher, isLoading: isCategoryFetchLoading, data: categoryData} = cacheContext.wpCategoryFetcher as FetchObject<WP_REST_API_Category>;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const queryOptions: Partial<FetchOptions> = {
            // NOTE: must reset slug in case of persisted slug value from navigating to an individual post page
            slugs: []
        }
        postFetcher(queryOptions);
    }, []);
    
    useEffect(() => {
        const queryOptions: Partial<FetchOptions> = {
            
        }
        
        mediaFetcher(queryOptions);
    }, []);
    
    useEffect(() => {
        const queryOptions: Partial<FetchOptions> = {
            
        }
        
        categoryFetcher(queryOptions);
    }, []);
    
    useEffect(() => {
        setIsLoading(isMediaFetchLoading || isPostFetchLoading || isCategoryFetchLoading);
    }, [isMediaFetchLoading, isPostFetchLoading, isCategoryFetchLoading]);
    
    const getCategoryNamesFromIds = (categoryQueryArry: string[] = categoryFilterArryProp) => {
        return categoryQueryArry.flatMap(categoryNameQuery => {
            const matchedCategory = categoryData.find(cachedCategoryObj => cachedCategoryObj.name?.toLowerCase() === categoryNameQuery);
            return matchedCategory ? [matchedCategory] : []
        });
    };
    
    const getIfCanShow = (resCategories: number[]) => {
        let canShow = false;
        const matchedCategories = getCategoryNamesFromIds();
        matchedCategories.map(matchedCategory => {
            const canFindCategory = resCategories.includes(matchedCategory.id as number);
            if(canFindCategory) canShow = true;
        });
        return canShow;
    };
    
    
    
    const blogPosts = useMemo(() => {
        if(!postData || !mediaData) return;
        const blogPostArry = postData.map(post => {
            const { id, featured_media, slug, categories} = post;
            const postMediaArry = featured_media === 0 ? [] : (mediaData as WP_REST_API_Attachment[]).flatMap((mediaItem: any) => mediaItem.id === featured_media ? [mediaItem] : []);
            
            if( categories !== undefined &&
                categoryFilterArryProp.length &&
                !categoryFilterArryProp.includes('all') &&
                !getIfCanShow(categories)
                ) return <React.Fragment key={id}></React.Fragment>
                
            return (
                <Link to={`${slug}`} className={styles.previewCardContainer} key={id}>
                    <BlogPreviewItem postMedia={postMediaArry} postData={post}/>
                </Link>
            );
        });
        return blogPostArry;
    }, [postData, mediaData, categoryData, categoryFilterArryProp]);

    const getRenderedElements = () => {
        if(isLoading) return <p>Loading...</p>;
        if(!blogPosts) return <p>An error occurred</p>;
        if(!(postData as WP_REST_API_Post[]).length) return <p>No blog posts found...</p>;
        return blogPosts;
    };

    return <>{getRenderedElements()}</>
};

export default PostArchive;
