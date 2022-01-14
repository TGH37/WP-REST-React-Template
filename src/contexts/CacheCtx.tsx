import React, { createContext, useState } from 'react';

interface CacheItem {
    url: string
    accessor: string
}

interface cacheCtx {
    defaultQueries: {
        rootDataQueries: string[],
        mediaDataQueries: string[],
        rootDataFetchFields: string[],
        mediaDataFetchFields: string[],
    },
    cacheItems: {
        blogCache: CacheItem
        recipesCache: CacheItem
        mediaCache: CacheItem
    }
};

const defaultState: cacheCtx = {
    defaultQueries: {
        rootDataQueries: ["id", "modified", "featured_media",],
        mediaDataQueries: ["id", "modified",],
        rootDataFetchFields: ["id", "title", "excerpt", "modified", "featured_media", "slug" ],
        mediaDataFetchFields: [ "id", "alt_text", "modified", "media_details", ],
    },
    cacheItems: {
        blogCache: { url: "http://port-keto-bl.wingtipdigital.com/wp-json/wp/v2/posts", accessor: "keto-bps", },
        recipesCache: { url: "http://port-keto-bl.wingtipdigital.com/wp-json/wp/v2/recipes", accessor: "keto-recipes", },
        mediaCache: { url: "http://port-keto-bl.wingtipdigital.com/wp-json/wp/v2/media", accessor: "keto-bps-media", },
    }
};

export const CacheCtx = createContext<cacheCtx>(defaultState);

interface Props {
    children: any
};

function CacheProvider(props: Props) {
    const { children } = props;
    const { defaultQueries, cacheItems } = defaultState;
    return (
    <CacheCtx.Provider value={{
        defaultQueries,
        cacheItems
    }}>
        {children}
    </CacheCtx.Provider>
    );
};

export default CacheProvider;