import React, { useEffect, useMemo, useState } from 'react';
import styles from 'src/styles/blog.module.scss';
import PageContentColumns from '../components/PageContentColumns';
import BlogPreviewItem from '../components/BlogPreviewItem';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { WP_REST_API_Post, WP_REST_API_Attachment } from 'wp-types'
import useCache from '../hooks/useCache';

interface Props {};

function BlogPage(props: Props) {
    const {} = props;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { url } = useRouteMatch();
    const rootUrl = "http://port-keto-bl.wingtipdigital.com/wp-json/wp/v2/posts", rootCacheKey = "keto-bps"; 
    const mediaUrl = "http://port-keto-bl.wingtipdigital.com/wp-json/wp/v2/media", mediaCacheKey = "keto-bps-media";

    const rootDataQueries = [
        "id",
        "modified",
        "featured_media",
    ];
    
    const mediaDataQueries = [
        "id",
        "modified",
    ]

    const rootDataFetchFields = [
        "id",
        "title",
        "excerpt",
        "modified",
        "featured_media",
        "slug" 
    ]
    const mediaDataFetchFields = [
        "id",
        "alt_text",
        "modified",
        "media_details",
    ]


    const [ wpAllData, isPostCacheLoading ] = useCache<WP_REST_API_Post>({url: rootUrl, watchFields: rootDataQueries, cacheFields: rootDataFetchFields, cacheKey: rootCacheKey});
    const [ wpMediaData, isMediaCacheLoading ] = useCache<WP_REST_API_Attachment>({url: mediaUrl, watchFields: mediaDataQueries, cacheFields: mediaDataFetchFields, cacheKey: mediaCacheKey});
    
    useEffect(() => {
        setIsLoading(isPostCacheLoading as boolean && isMediaCacheLoading as boolean);
    }, [])
        
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

    
    
    const getRenderedElements = () => {
        console.log("page render")
            if(isLoading) return <p>Loading...</p>;
            if(!blogPosts) return <p>An error occurred</p>;
            if(!(wpAllData as WP_REST_API_Post[]).length) return <p>No blog posts found...</p>;
            return blogPosts;
        };
        
    return (
        <PageContentColumns title={"Blog"}>
            { getRenderedElements() }
        </PageContentColumns>
    );
};

export default BlogPage;
