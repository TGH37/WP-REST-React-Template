// cacheCtx
import React, { createContext, useState } from 'react';
import { WP_REST_API_Attachment, WP_REST_API_Category, WP_REST_API_Post } from 'wp-types';
import useCache from '../hooks/useCache';
import useWPFetcher from '../hooks/useWPFetcher';

interface CacheItem {
    url: string
    accessor: string
}

interface cacheCtx {
   
    wpPostFetcher: FetchObject<WP_REST_API_Post> | null
    wpMediaFetcher: FetchObject<WP_REST_API_Attachment> | null
    wpRecipeFetcher: FetchObject<WP_REST_API_Post> | null
    wpCategoryFetcher: FetchObject<WP_REST_API_Category> | null
    wpPageFetcher: FetchObject<WP_REST_API_Post> | null
}; 

const defaultState: cacheCtx = {
    wpPostFetcher: null,
    wpMediaFetcher: null,
    wpRecipeFetcher: null,
    wpCategoryFetcher: null,
    wpPageFetcher: null,
};

export const CacheCtx = createContext<cacheCtx>(defaultState);

interface Props {
    children: any
};

function CacheProvider(props: Props) {
    const { children } = props;

    const cachedPostsData: CacheObject<WP_REST_API_Post> = useCache<WP_REST_API_Post>({cacheKey: "keto-bps"});
    const cachedMediaData: CacheObject<WP_REST_API_Attachment> = useCache<WP_REST_API_Attachment>({cacheKey: "keto-bps-media"});
    const cachedRecipesData: CacheObject<WP_REST_API_Post> = useCache<WP_REST_API_Post>({cacheKey: "keto-recipes"});
    const cachedCategoryData: CacheObject<WP_REST_API_Category> = useCache<WP_REST_API_Category>({cacheKey: "keto-categories"});

    const wpPostFetcher = useWPFetcher<WP_REST_API_Post>({cacheObj: cachedPostsData, endpoint: "posts"});
    const wpMediaFetcher = useWPFetcher<WP_REST_API_Attachment>({cacheObj: cachedMediaData, endpoint: "media"});
    const wpRecipeFetcher = useWPFetcher<WP_REST_API_Post>({cacheObj: cachedRecipesData, endpoint: "recipes"});
    const wpCategoryFetcher = useWPFetcher<WP_REST_API_Category>({cacheObj: cachedCategoryData, endpoint: "categories"});
    const wpPageFetcher = useWPFetcher<WP_REST_API_Post>({endpoint: "pages"});
    
    return (
    <CacheCtx.Provider value={{

        wpPostFetcher,
        wpMediaFetcher,
        wpRecipeFetcher,
        wpCategoryFetcher,
        wpPageFetcher,
        
    }}>
        {children}
    </CacheCtx.Provider>
    );
};

export default CacheProvider;