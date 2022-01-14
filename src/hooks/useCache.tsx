import React, { useEffect, useState } from 'react';
import { WP_REST_API_Date_Time, WP_REST_API_Post } from 'wp-types';

interface CacheProps {
    url: string
    watchFields: string[]
    cacheFields: string[]
    cacheKey: string
};

function useCache<CacheType extends WPTH_Cached_WP_Object>(props: CacheProps) {
    const {url, watchFields, cacheKey, cacheFields} = props;

    const cacheFieldsUrlSection = `?_fields=${cacheFields.toString()}`;
    const [isUpdateRequired, setIsUpdateRequired] = useState<boolean>(false);
    const [invalidCacheObjects, setInvalidCacheObjects] = useState<number[]>([]);
    const [fetchRes, setFetchRes] = useState<rootDataProbeResponse[] | [] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [cachedData, setCachedData] = useState<CacheType[]>([])

    const getParsedCacheData = (): Array<any> => {
        const cachedValueRaw = window.sessionStorage.getItem(cacheKey);
        return cachedValueRaw ? JSON.parse(cachedValueRaw) : [];
    }

    const fetchServerUpdateFields = async () => {
        try {
            const res = await fetch(`${url}?_fields=${watchFields.toString()}`);
            const resJSON = await res.json();
            setFetchRes(resJSON);
            return resJSON;
        } catch (err) {
            console.log("fetch error: " + err);
            setFetchRes(null);
            return {};
        };
    };

    function getUpdateRequirementsList(cachedObjects: CacheType[]): CacheProbeResult[] {
        if(fetchRes === null) return [];
        return fetchRes.map((resObj: rootDataProbeResponse): CacheProbeResult => {
            const isStillUsed = !!cachedObjects.find((cacheObj: CacheType) => resObj.id === cacheObj.id);
            const hasBeenModified = !!cachedObjects.find((cacheObj: CacheType) => resObj.modified === cacheObj.modified);
            const isStillValid = isStillUsed && hasBeenModified;
            return {
                id: resObj.id,
                isStillValid,
            };
        });
    };

    function checkCacheUpdatesRequired(){
        // Probe CMS to compare server objects with any cached objects in the browser
        // If a object hasn't been cached, or a cached object is outdated, trigger a full info fetch for that object
        if(fetchRes === null) return {success: false, isUpdateRequired: true} as cacheUpdateFail;
        if(cachedData === []) return {success: true, isUpdateRequired: true};

        const matchedObjects = getUpdateRequirementsList(cachedData);
        const invalidObjects = matchedObjects.flatMap((postObj: CacheProbeResult) => postObj.isStillValid ? [] : postObj.id);
        setIsUpdateRequired(!!invalidObjects.length);
        setInvalidCacheObjects(invalidObjects);

        return {success: true, matchedPosts: matchedObjects, isUpdateRequired: !!invalidObjects.length} as cacheUpdateSuccess;
    }

    function mergeCacheAndFetchData(resArry: CacheType[]): CacheType[] {
        if(cachedData === []) return resArry;
        const returnArry = (Array.from(cachedData) as unknown) as CacheType[];
        resArry.map((resObj) => {
            const matchedIdx = returnArry.findIndex((cacheObj) => cacheObj.id === resObj.id);
            if(matchedIdx < 0) returnArry.push(resObj);
            else returnArry[matchedIdx] = resObj; 
        });
        return returnArry;
    };

    function updateCache(cacheKey: string, fetchResponse: Array<any>) {
        const updatedCacheDataArry = mergeCacheAndFetchData(fetchResponse);
        const saveData = JSON.stringify(updatedCacheDataArry);
        window.sessionStorage.setItem(cacheKey, saveData);
    };

    // const removeFromCache = () => {
    //     const itemsToRemove = cachedData.find(cachedObj => cachedObj === fetchRes);
    //     const cachedValues = getParsedCacheData(cacheKey);
    //     itemsToRemove.map(matchObj => {
    //         const idxToRemove = cachedValues.findIndex(cacheObj => cacheObj.id === matchObj.id);
    //         cachedValues.splice(idxToRemove);
    //     });
    //     const saveData = JSON.stringify(cachedValues);
    //     window.sessionStorage.setItem(cacheKey, saveData);
    // };

    const getFetchQuery = (): string => {
        const includeQuerySegment = invalidCacheObjects.length ? `include[]=${invalidCacheObjects.toString().replace(/,/g,"&include[]=")}` : "";
        return `?${includeQuerySegment}&${cacheFieldsUrlSection}`;
    };

    const fetchAndCache = async (query: string) => {
        try {
            const res = await fetch(`${url}${query}`);
            const resJson = await res.json();
            updateCache(cacheKey, resJson);
        } catch (err) {
            console.log("All Data Fetch Error: " + err);           
        };
    };

    const runCacheUpdate = async () => {
        setIsLoading(true);
        const fullQueryString = getFetchQuery();
        await fetchAndCache(fullQueryString);
        setCachedData(getParsedCacheData());
        setIsLoading(false);
    }

    useEffect(() => {
        setCachedData(getParsedCacheData());
        fetchServerUpdateFields();
    }, []);
    
    useEffect(() => {
        // console.log(fetchRes)
        checkCacheUpdatesRequired();
    }, [fetchRes]);

    useEffect(() => {       
        console.log(invalidCacheObjects) 
        if(!isUpdateRequired) return;
        runCacheUpdate();
    }, [isUpdateRequired]);



    return [cachedData, isLoading];
}

export default useCache;
