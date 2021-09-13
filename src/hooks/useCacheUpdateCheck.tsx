import { useEffect, useState } from "react";

type customPostTypeSlug  = "posts" | "recipes"; // post types defined with the "Custom Post Type UI" Wordpress plugin

interface Props {
    cachedData: any[]
    postTypeSlug: customPostTypeSlug
    
}

function useCacheUpdateCheck(props: Props) {
    const {
        cachedData,
        postTypeSlug,
        
    } = props

    type cacheMatch = {id: number, isStillValid: boolean};
    type cacheUpdateSuccess = {success: boolean, isUpdateRequired: boolean, matchedPosts: cacheMatch[]};
    type cacheUpdateFail = {success: boolean, isUpdateRequired: boolean, err?: any};
    type cacheUpdate = cacheUpdateSuccess | cacheUpdateFail;

    const [cacheUpdateStatus, setCacheUpdateStatus] = useState<cacheUpdate | null>(null)

    useEffect(() => {
        // Probe db to compare posts with any cached posts in the browser
        // If a post hasn't been cached, or a cached post is outdated, trigger a full info fetch for that post
        fetch(`http://www.react-test.dev.cc/wp-json/wp/v2/${postTypeSlug}?_fields=id,modified`)
        .then(res => res.json())
        .then(resJSON => {
            if(!cachedData.length) return {success: true, isUpdateRequired: true, matchedPosts: []} as cacheUpdateSuccess;
            const matchedPosts = cachedData?.map((storageObj: any) => (
                {
                    id: storageObj.id, 
                    isStillValid: !!resJSON.find((resObj: {id: number, modified: string}) => resObj.id === storageObj.id && resObj.modified === storageObj.modified
                )}
            ));
            const invalidPosts = matchedPosts.filter((postObj: cacheMatch) => !postObj.isStillValid);
            setCacheUpdateStatus({success: true, matchedPosts, isUpdateRequired: !!invalidPosts.length} as cacheUpdateSuccess);
        })
        .catch(err => {
            console.log("Probe Data Fetch Error: " + err);
            setCacheUpdateStatus({success: false, err, isUpdateRequired: true} as cacheUpdateFail);
        });
        
    }, [])
    return cacheUpdateStatus;
};

export default useCacheUpdateCheck;
