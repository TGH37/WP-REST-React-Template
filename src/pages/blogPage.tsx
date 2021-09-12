import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import styles from 'src/styles/blog.module.scss';
import PageContentColumns from '../components/PageContentColumns';
import BlogPreviewItem from '../components/BlogPreviewItem';
import { Switch, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {};

function BlogPage(props: Props) {
    const {} = props;
    const [wpData, setWpData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { url, path } = useRouteMatch();

    type cacheMatch = {id: number, isStillValid: boolean};
    type cacheUpdateResponse = {success: boolean, isUpdateRequired?: boolean, matchedPosts?: cacheMatch[], err?: any};
    // TODO Configure to have response composed of success and fail
    type cacheUpdateSuccess = {success: boolean, isUpdateRequired: boolean, matchedPosts: cacheMatch[]};
    type cacheUpdateFail = {success: boolean, isUpdateRequired: boolean, err?: any};

    const saveLocalStorage = (res: any) => {
        
    }

    const getParsedCache = (): Array<any> => {
        const cachedValueRaw = window.sessionStorage.getItem("keto-bps");
        // return cachedValueRaw ? [cachedValueRaw] : []
        return cachedValueRaw ? JSON.parse(cachedValueRaw) : [];
    }

    useEffect(() => {
        // const cacheUpdateRes: cacheUpdateResponse = checkCacheUpdateRequiredWithDB();
        // if(!cacheUpdateRes.success) {
        //     fetchAllPosts();
        //     return
        // }
        // if(cacheUpdateRes.success && !cacheUpdateRes.isUpdateRequired) {
        //     setIsLoading(false);
        //     return;
        // }
        // const successfulCacheUpdateResponse = cacheUpdateRes as cacheUpdateSuccess;
        // const cachePostsToUpdate = successfulCacheUpdateResponse.matchedPosts.filter((response: cacheMatch) => !response.isStillValid);
        // const updateIds = cachePostsToUpdate.map(post => post.id);
        // const updateIdsString = updateIds.toString();
        // const updateIdQueryParam = updateIdsString.replace(",","/");
        // console.log(updateIdQueryParam)

        const mergedCacheAndFetchData = (cachedArry: Array<any>, resArry: Array<any>): Array<any> => {
            if(cachedArry === []) return resArry;
            const returnArry = [...cachedArry];
            resArry.map((resObj) => {
                const matchedIdx = cachedArry.findIndex(cacheObj => cacheObj.id === resObj.id);
                if(matchedIdx === -1) returnArry.push(resObj)
                else returnArry[matchedIdx] = resObj; 
            })
            return returnArry;
        }


        fetch("http://www.react-test.dev.cc/wp-json/wp/v2/posts")
            .then( res => res.json())
            .then((formattedRes: Array<any>) => {
                setWpData(formattedRes); 
                setIsLoading(false);

                const cachedValueArry = getParsedCache();
                const updatedCacheDataArry = mergedCacheAndFetchData(cachedValueArry, formattedRes);
                const saveData = JSON.stringify(updatedCacheDataArry);

                window.sessionStorage.setItem("keto-bps", saveData);
            })
            .catch(err =>{
                console.log(err);
                setIsLoading(false);
            });
        }, []);

    const fetchAllPosts = () => {
        fetch("http://www.react-test.dev.cc/wp-json/wp/v2/posts")
            .then( res => res.json())
            .then(formattedRes => {
                setWpData(formattedRes); 
                setIsLoading(false);
            })
            .catch(err =>{
                // TODO improve error logging
                console.log(err);
                setIsLoading(false);
            });
    };

        
    const checkCacheUpdateRequiredWithDB = (): cacheUpdateResponse => {
        // Probe db to compare posts with any cached posts in the browser
        // If a post hasn't been cached, or a cached post is outdated, trigger a full info fetch for that post
        let status: cacheUpdateResponse = {success: false};
        let isUpdateRequired = false;
        fetch("http://www.react-test.dev.cc/wp-json/wp/v2/posts?_fields=id,modified")
        .then(res => res.json())
        .then(resJSON => {
            const fromStorage = window.sessionStorage.getItem("keto-bps");
            // TODO set this to have a "should update all" effect, or separate that logic into separate function
            if(fromStorage === null) {status = {success: true}; return status};
            const parsedStorage = JSON.parse(fromStorage);
            const matchedPosts = parsedStorage?.map((storageObj: any) => ({id: storageObj.id, isStllValid: !!resJSON.find((resObj: {id: number, modified: string}) => {
                const shouldUpdate = resObj.id === storageObj.id && resObj.modified === storageObj.modified;
                if(shouldUpdate && !isUpdateRequired) isUpdateRequired = true;
                return shouldUpdate
            })}));
            status = {success: true, matchedPosts, isUpdateRequired}
        })
        .catch(err => status = {success: false, err})
        return status;
    }

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
