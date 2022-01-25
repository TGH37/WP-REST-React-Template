import React, { useContext, useEffect, useMemo, useState } from 'react';
import PageContentColumns from '../components/PageContentColumns';
import PostArchive from '../components/PostArchive';
import {CacheCtx} from '../contexts/CacheCtx';
import { WP_REST_API_Post } from 'wp-types';
import { useSearchParams } from 'react-router-dom'
import useWPCategoryFilter from '../hooks/useWPCategoryFilter';

interface Props {};

  function RecipesPage(props: Props) {
      const {} = props;
      
      const cacheContext = useContext(CacheCtx);
      const validCategories = useWPCategoryFilter({})
    
    return (
        <PageContentColumns title={`recipes: ${validCategories.length ? validCategories.join(" & ") : "all"}`}>
            <PostArchive postFetcherProp={cacheContext.wpRecipeFetcher as FetchObject<WP_REST_API_Post>} categoryFilterArryProp={validCategories.length ? validCategories : ['all']}/>
        </PageContentColumns>
    );
};

export default RecipesPage;
