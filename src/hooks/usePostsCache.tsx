import React, { useEffect, useState } from 'react'
import useCacheUpdateCheck from './useCacheUpdateCheck';
import useParsedCache from './useParsedCache';

interface Props {
    postsCacheKey: string
    postsUrl?: string
    
}

function usePostsCache(props: Props) {
    const {
        // postsCacheKey,
        // postsUrl
        
    } = props

    const [wpData, setWpData] = useState<any>(null);

    type cacheMatch = {id: number, isStillValid: boolean};
    type cacheUpdateSuccess = {success: boolean, isUpdateRequired: boolean, matchedPosts: cacheMatch[]};
    type cacheUpdateFail = {success: boolean, isUpdateRequired: boolean, err?: any};

    const postsUrl = "http://www.react-test.dev.cc/wp-json/wp/v2/posts", postsCacheKey = "keto-bps";

    const cachedPostData = useParsedCache({cacheKey: postsCacheKey});
    const cacheUpdateStatus = useCacheUpdateCheck({cachedData: cachedPostData, postTypeSlug: "posts"})

 

    // const fetchAndCache = (urlPath: string, cacheKey: string, queryString: string = "") => {
    //     fetch(`${urlPath}${queryString}`)
    //         .then( res => res.json())
    //         .then((formattedRes: Array<any>) => {
    //             // const cachedValueArry = getParsedCache();
    //             const updatedCacheDataArry = mergeCacheAndFetchData(cachedPostData, formattedRes);
    //             const saveData = JSON.stringify(updatedCacheDataArry);
                
    //             window.sessionStorage.setItem(cacheKey, saveData);
    //         })
    //         .then(() => {
    //             setWpData(cachedPostData); 
    //             // setIsLoading(false);
    //         })
    //         .catch(err =>{
    //             console.log("All Data Fetch Error: " + err);
    //             // setIsLoading(false);
    //         });
    // }

    // const mergeCacheAndFetchData = (cachedArry: Array<any>, resArry: Array<any>): Array<any> => {
    //     if(cachedArry === []) return resArry;
    //     const returnArry = [...cachedArry];
    //     resArry.map((resObj) => {
    //         const matchedIdx = cachedArry.findIndex(cacheObj => cacheObj.id === resObj.id);
    //         if(matchedIdx === -1) returnArry.push(resObj)
    //         else returnArry[matchedIdx] = resObj; 
    //     })
    //     return returnArry;
    // }


    // useEffect(() => {
    //     // TODO: test errors
    //     checkCacheUpdateRequiredWithDB()
    //         .then(cacheUpdateRes => {
                
    //             if(!cacheUpdateRes.success) {
    //                 fetchAndCache(postsUrl, postsCacheKey);
    //                 throw new Error("unsuccessful");
    //             }
    //             if(!cacheUpdateRes.isUpdateRequired) {
    //                 // setIsLoading(false);
    //                 setWpData(cachedPostData);
    //                 return null;
    //             }
    //             const successfulCacheUpdateResponse = cacheUpdateRes as cacheUpdateSuccess;
    //             const cachePostsToUpdate = successfulCacheUpdateResponse.matchedPosts.filter((post: cacheMatch) => !post.isStillValid);
    //             if(!cachePostsToUpdate.length) return "";
    //             const updateIds = cachePostsToUpdate.map(post => post.id);
    //             return `?include[]=${updateIds.toString().replace(",","&include[]=")}`; // '&include[]=' is the syntax for querying specific id's
    //         })
    //         .then( queryString => {
    //             if(queryString === null) return;
    //             if(queryString.length) fetchAndCache(postsUrl, postsCacheKey, queryString);
    //             else fetchAndCache(postsUrl, postsCacheKey);
    //         })
    //         .catch(err => {
    //             console.log("Final Error: " + err);
    //         });

    //     }, []);

    return "foo";
};

export default usePostsCache;
