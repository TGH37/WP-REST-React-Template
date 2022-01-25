import React, { useContext } from 'react';
import styles from 'src/styles/blog.module.scss';
import PageContentColumns from '../components/PageContentColumns';
import { WP_REST_API_Post } from 'wp-types'
import PostArchive from '../components/PostArchive';
import {CacheCtx} from '../contexts/CacheCtx';

interface Props {};

function BlogPage(props: Props) {
    const {} = props;
    
    const cacheContext = useContext(CacheCtx);

    return (
        <PageContentColumns title={"Blog"}>
            <PostArchive postFetcherProp={cacheContext.wpPostFetcher as FetchObject<WP_REST_API_Post>}/>
        </PageContentColumns>
    );
};

export default BlogPage;
