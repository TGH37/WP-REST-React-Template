import React, { useEffect, useMemo, useState } from 'react';
import styles from 'src/styles/blog.module.scss';
import PageContentColumns from '../components/PageContentColumns';
import BlogPreviewItem from '../components/BlogPreviewItem';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {};

function BlogPage(props: Props) {
    const {} = props;
    const [wpData, setWpData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { url } = useRouteMatch();

    type cacheMatch = {id: number, isStillValid: boolean};
    type cacheUpdateSuccess = {success: boolean, isUpdateRequired: boolean, matchedPosts: cacheMatch[]};
    type cacheUpdateFail = {success: boolean, isUpdateRequired: boolean, err?: any};


    const getParsedCache = (key: string = "keto-bps"): Array<any> => {
        const cachedValueRaw = window.sessionStorage.getItem(key);
        return cachedValueRaw ? JSON.parse(cachedValueRaw) : [];
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
    useEffect(() => {
        checkCacheUpdateRequiredWithDB()
            .then(cacheUpdateRes => {
                if(!cacheUpdateRes.success) {
                    fetchAndCache();
                    throw new Error("unsuccessful");
                }
                if(!cacheUpdateRes.isUpdateRequired) {
                    setIsLoading(false);
                    setWpData(getParsedCache());
                    return null;
                }
                const successfulCacheUpdateResponse = cacheUpdateRes as cacheUpdateSuccess;
                const cachePostsToUpdate = successfulCacheUpdateResponse.matchedPosts.filter((post: cacheMatch) => !post.isStillValid);
                if(!cachePostsToUpdate.length) return "";
                const updateIds = cachePostsToUpdate.map(post => post.id);
                return `?include[]=${updateIds.toString().replace(",","&include[]=")}`; // '&include[]=' is the syntax for querying specific id's
            })
            .then( queryString => {
                if(queryString === null) return;
                if(queryString.length) fetchAndCache(queryString);
                else fetchAndCache();
            })
            .catch(err => {
                console.log("Final Error: " + err);
            });

        }, []);
        
        const fetchAndCache = (queryString: string = "") => {
            fetch(`http://www.react-test.dev.cc/wp-json/wp/v2/posts${queryString}`)
                .then( res => res.json())
                .then((formattedRes: Array<any>) => {
                    const cachedValueArry = getParsedCache();
                    const updatedCacheDataArry = mergeCacheAndFetchData(cachedValueArry, formattedRes);
                    const saveData = JSON.stringify(updatedCacheDataArry);
                    
                    window.sessionStorage.setItem("keto-bps", saveData);
                })
                .then(() => {
                    setWpData(getParsedCache()); 
                    setIsLoading(false);
                })
                .catch(err =>{
                    console.log("All Data Fetch Error: " + err);
                    setIsLoading(false);
                });
        }

        
    const checkCacheUpdateRequiredWithDB = () => {
        // Probe db to compare posts with any cached posts in the browser
        // If a post hasn't been cached, or a cached post is outdated, trigger a full info fetch for that post
        return fetch("http://www.react-test.dev.cc/wp-json/wp/v2/posts?_fields=id,modified")
        .then(res => res.json())
        .then(resJSON => {
            // TODO set this to have a "should update all" effect, or separate that logic into separate function
            const cachedValueArry = getParsedCache();
            if(!cachedValueArry.length) return {success: true, isUpdateRequired: true, matchedPosts: []} as cacheUpdateSuccess;
            const matchedPosts = cachedValueArry?.map((storageObj: any) => (
                {
                    id: storageObj.id, 
                    isStillValid: !!resJSON.find((resObj: {id: number, modified: string}) => resObj.id === storageObj.id && resObj.modified === storageObj.modified
                )}
            ));
            const invalidPosts = matchedPosts.filter((postObj: cacheMatch) => !postObj.isStillValid);
            return {success: true, matchedPosts, isUpdateRequired: !!invalidPosts.length} as cacheUpdateSuccess;
        })
        .catch(err => {
            console.log("Probe Data Fetch Error: " + err);
            return{success: false, err, isUpdateRequired: true} as cacheUpdateFail;
        });
    };

    const blogPosts = useMemo(() => {
        if(!wpData) return;
        const postArry = Array.from(wpData);
        const blogPostArry = postArry.map((post: any) => {
            const { title, excerpt, modified, id, featured_media, slug}: {title: {rendered: string}, excerpt: {rendered: string, protected: boolean,}, modified: string, id: number, featured_media: number, slug: string} = post;
            return <Link to={`${url}/${slug}`} className={styles.previewCardContainer}><BlogPreviewItem title={title.rendered} excerpt={excerpt.rendered} meta={[modified]} key={`blog_post_prev_id:${id}`} feautredMediaId={featured_media}/></Link>;
        });
        setIsLoading(false);
        return blogPostArry;
    }, [wpData]);


    const getRenderedElements = () => {
        if(isLoading) return <p>Loading...</p>;
        if(!blogPosts) return <p>An error occurred</p>;
        if(!blogPosts.length) return <p>No blog posts found...</p>;
        return blogPosts;
    };

    return (
        <PageContentColumns title={"Blog"}>
            { getRenderedElements() }
        </PageContentColumns>
    );
};

export default BlogPage;
