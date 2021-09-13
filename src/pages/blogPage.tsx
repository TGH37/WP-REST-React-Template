import React, { useEffect, useMemo, useState } from 'react';
import styles from 'src/styles/blog.module.scss';
import PageContentColumns from '../components/PageContentColumns';
import BlogPreviewItem from '../components/BlogPreviewItem';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {};

function BlogPage(props: Props) {
    const {} = props;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { url } = useRouteMatch();
    const rootUrl = "http://www.react-test.dev.cc/wp-json/wp/v2/posts", rootCacheKey = "keto-bps"; 
    const mediaUrl = "http://www.react-test.dev.cc/wp-json/wp/v2/media", mediaCacheKey = "keto-bps-media";
    
    
    type mediaCacheMatch = {id: number, isStillValid: boolean};
    type mediaCacheUpdateSuccess = {success: boolean, isUpdateRequired: boolean, matchedMediaObjects: mediaCacheMatch[]};
    type mediaDataProbeResponse = {id: number, modified: string};
    
    type cacheMatch = {id: number, mediaId: number, isStillValid: boolean, isMediaUrlValid: boolean};
    type cacheUpdateSuccess = {success: boolean, isUpdateRequired: boolean, matchedPosts: cacheMatch[]};
    type cacheUpdateFail = {success: boolean, isUpdateRequired: boolean, err?: any};
    type updateQuery = {root: string, media: string};
    type rootDataProbeResponse = {id: number, modified: string, featured_media: number};
    
    const getParsedCache = (key: string = rootCacheKey): Array<any> => {
        const cachedValueRaw = window.sessionStorage.getItem(key);
        return cachedValueRaw ? JSON.parse(cachedValueRaw) : [];
    }
    // const [wpAllPostIds, setAllPostIds] = useState<cacheMatch[] | []>(getParsedCache(rootCacheKey).map(post => ({id: post.id, isStillValid: true, isMediaUrlValid: true})));
    const [wpAllData, setWpAllData] = useState<any>(getParsedCache(rootCacheKey));
    const [wpMediaData, setWpMediaData] = useState<any>(getParsedCache(mediaCacheKey));

    const rootDataQueries = [
        "id",
        "modified",
        "featured_media",
    ];
    
    const mediaDataQueries = [
        "id",
        "modified",
    ]

    

    const checkCacheUpdateRequiredWithDB = () => {
        // Probe db to compare posts with any cached posts in the browser
        // If a post hasn't been cached, or a cached post is outdated, trigger a full info fetch for that post

        return fetch(`${rootUrl}?_fields=${rootDataQueries.toString()}`)
        .then(res => res.json())
        .then((resJSON: Array<rootDataProbeResponse>) => {
            const cachedValueArry = getParsedCache(rootCacheKey);
            const matchedPosts: cacheMatch[] | [] = resJSON?.map((resObj: rootDataProbeResponse): cacheMatch => {
                const isStillValid = !!cachedValueArry.find((cacheObj: any) => resObj.id === cacheObj.id && resObj.modified === cacheObj.modified);
                const isMediaUrlValid = isStillValid ? true : !!cachedValueArry.find((cacheObj: any) => resObj.id === cacheObj.id && resObj.featured_media === cacheObj.featured_media);
                return {
                    id: resObj.id,
                    mediaId: resObj.featured_media,
                    isStillValid,
                    isMediaUrlValid
                };
            });
            const invalidPosts = matchedPosts.filter((postObj: cacheMatch) => !postObj.isStillValid);
            return {success: true, matchedPosts, isUpdateRequired: !!invalidPosts.length} as cacheUpdateSuccess;
        })
        .catch(err => {
            console.log("Probe Data Fetch Error: " + err);
            return{success: false, err, isUpdateRequired: true} as cacheUpdateFail;
        });
    };

    const checkMediaCacheUpdateRequiredWithDB = () => {
        return fetch(`${mediaUrl}?_fields=${mediaDataQueries.toString()}`)
            .then(res => res.json())
            .then((resJSON: Array<mediaDataProbeResponse>) => {
                const cachedValueArry = getParsedCache(mediaCacheKey);
                const matchedMediaObjects: mediaCacheMatch[] | [] = resJSON?.map((resObj: mediaDataProbeResponse): mediaCacheMatch => {
                    const isStillValid = !!cachedValueArry.find((cacheObj: any) => resObj.id === cacheObj.id && resObj.modified === cacheObj.modified);
                    return {
                        id: resObj.id,
                        isStillValid,
                    };
                });
                const invalidCachedObjects = matchedMediaObjects.filter((mediaObj: mediaCacheMatch) => !mediaObj.isStillValid);
                return {success: true, matchedMediaObjects, isUpdateRequired: !!invalidCachedObjects.length} as mediaCacheUpdateSuccess;
            })
            .catch(err => {
                console.log("Media Probe Data Fetch Error: " + err);
                return{success: false, err, isUpdateRequired: true} as cacheUpdateFail;
            });

    }

    const mergeCacheAndFetchData = (cachedArry: Array<any>, resArry: Array<any>): Array<any> => {
        if(cachedArry === []) return resArry;
        const returnArry = [...cachedArry];
        resArry.map((resObj) => {
            const matchedIdx = cachedArry.findIndex(cacheObj => cacheObj.id === resObj.id);
            if(matchedIdx === -1) returnArry.push(resObj)
            else returnArry[matchedIdx] = resObj; 
        })
        return returnArry;
    }

    const fetchAndCache = (urlPath: string, cacheKey: string, queryString: string = "") => {
        fetch(`${urlPath}${queryString}`)
            .then( res => res.json())
            .then((formattedRes: Array<any>) => {
                updateCache(cacheKey, formattedRes);
            })
            .then(() => {
                cacheKey === rootCacheKey ? setWpAllData(getParsedCache(cacheKey)) : setWpMediaData(getParsedCache(cacheKey)); 
                setIsLoading(false);
            })
            .catch(err =>{
                console.log("All Data Fetch Error: " + err);
                setIsLoading(false);
            });
    };
    const updateCache = (cacheKey: string, fetchResponse: Array<any>) => {
        const cachedValueArry = getParsedCache(cacheKey);
        const updatedCacheDataArry = mergeCacheAndFetchData(cachedValueArry, fetchResponse);
        const saveData = JSON.stringify(updatedCacheDataArry);
        window.sessionStorage.setItem(cacheKey, saveData);
    }

    useEffect(() => {
        // TODO: test errors
        checkCacheUpdateRequiredWithDB()
            .then(cacheUpdateRes => {
                if(!cacheUpdateRes.success) {
                    fetchAndCache(rootUrl, rootCacheKey);
                    fetchAndCache(mediaUrl, mediaCacheKey);
                    throw new Error("unsuccessful");
                }
                if(!cacheUpdateRes.isUpdateRequired) {
                    setIsLoading(false);
                    return null;
                }
                const successfulCacheUpdateResponse = cacheUpdateRes as cacheUpdateSuccess;
                const allPosts = successfulCacheUpdateResponse.matchedPosts;

                const cachePostsToUpdate = allPosts.filter((post: cacheMatch) => !post.isStillValid);
                const updateIds = cachePostsToUpdate.map(post => ({id: post.id, isMediaUrlValid: post.isMediaUrlValid, mediaId: post.mediaId}));
                return getQueryParams(updateIds);
            })
            .then( (queryString: updateQuery | null) => {
                if(queryString === null) return;
                fetchAndCache(rootUrl, rootCacheKey, queryString.root);
                fetchAndCache(mediaUrl, mediaCacheKey, queryString.media);
            })
            .then(() => {

            })
            .catch(err => {
                console.log("Final Error: " + err);
            });

        }, []);

        const getQueryParams = (idObjArry: Array<{id: number, isMediaUrlValid: boolean, mediaId: number}>): updateQuery => {
            const ids = idObjArry.map(idObj => idObj.id);
            const mediaArry = idObjArry.flatMap(idObj => {
                if(idObj.isMediaUrlValid || idObj.mediaId === 0) return [];
                return [idObj.mediaId];
            });

            return {
                root: `?include[]=${ids.toString().replace(/,/g,"&include[]=")}`,
                media: `?include[]=${mediaArry.toString().replace(/,/g,"&include[]=")}`
            };
        }
        
    

    const blogPosts = useMemo(() => {
        if(!wpAllData || !wpMediaData) return;
        const postArry = Array.from(wpAllData);
        const mediaArry = Array.from(wpMediaData);
        const blogPostArry = postArry.map((post: any) => {
            const { title, excerpt, modified, id, featured_media, slug}: {title: {rendered: string}, excerpt: {rendered: string, protected: boolean,}, modified: string, id: number, featured_media: number, slug: string} = post;
            const postUrlArry = featured_media === 0 ? [] : mediaArry.flatMap((mediaItem: any) => [mediaItem.media_details.sizes.full.source_url]);
            const postUrl = postUrlArry.length ? postUrlArry[0] : "";
            return (
                <Link to={`${url}/${slug}`} className={styles.previewCardContainer} key={`blog_post_prev_id:${id}`}>
                    <BlogPreviewItem title={title.rendered} excerpt={excerpt.rendered} meta={[modified]} postUrl={postUrl}/>
                </Link>
            );
        });
        return blogPostArry;
    }, [wpAllData]);

    
    
    const getRenderedElements = () => {
            if(isLoading) return <p>Loading...</p>;
            if(!blogPosts) return <p>An error occurred</p>;
            if(!wpAllData.length) return <p>No blog posts found...</p>;
            return blogPosts;
        };
        
    console.log("Rendered page")
    return (
        <PageContentColumns title={"Blog"}>
            { getRenderedElements() }
        </PageContentColumns>
    );
};

export default BlogPage;
