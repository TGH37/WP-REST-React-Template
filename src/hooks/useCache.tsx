import React, { useEffect, useMemo, useState } from 'react';
import useWPFetcher from './useWPFetcher';

interface CacheProps {
    endpoint?: WP_Endpoint
    urlRoot?: string
    // watchFields: string[]
    cacheFields?: string[]
    cacheKey: string
    options?: Partial<CacheOptions>
};



// NOTE: Think about using media breakpoints to control caching mode, e.g. mobile devices may require lean caching for memory reasons
// NOTE: if implementing logging on client side, may want to store details such as when caching errors

interface CacheOptions {
    mode: "lean" | "verbose"
    cacheSource: "localStorage" | "sessionStorage" | "cookie" //TODO: Implement different caching solutions
    appendQuery: string
    update: "auto" | "manual"
}

function useCache<CacheType extends WPTH_Cached_WP_Object>(props: CacheProps) {
    const { 
            cacheKey,
            cacheFields = [],
            options,
        } = props;

    const [isUpdateRequired, setIsUpdateRequired] = useState<boolean>(false);
    const [invalidCacheObjects, setInvalidCacheObjects] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [fetchRes, setFetchRes] = useState<WPProbeResponse[] | null>(null);
    
    const defaultCacheOptions: CacheOptions = useMemo(() => {
        return {
            mode: "verbose",
            cacheSource: "sessionStorage",
            appendQuery: '',
            update: "auto",
        };
    }, []);
    
    const [cacheOptions, setCacheOptions] = useState<CacheOptions>(defaultCacheOptions);
    
    const mergeOptions = () => {
        setCacheOptions({ ...defaultCacheOptions, ...options });
    };
    
    // NOTE: read, parse and return cached data from 
    const readCacheDataAndParse = (): Array<any> => {
        const cachedValueRaw = window.sessionStorage.getItem(cacheKey);
        return cachedValueRaw ? JSON.parse(cachedValueRaw) : [];
    };
    const [cachedData, setCachedData] = useState<CacheType[]>(readCacheDataAndParse());
    
    const getUpdateRequirementsList = (fetchRes: WPProbeResponse[] | null, cachedObjects: CacheType[]): CacheProbeResult[] => {
        if(fetchRes === null) return [];
        return fetchRes.map((resObj: WPProbeResponse): CacheProbeResult => {
            const isStillUsed = !!cachedObjects.find((cacheObj: CacheType) => resObj.id === cacheObj.id);
            const hasBeenModified = !!cachedObjects.find((cacheObj: CacheType) => resObj.modified === cacheObj.modified);
            const isStillValid = isStillUsed && hasBeenModified;
            return {
                id: resObj.id,
                isStillValid,
            };
        });
    };
    
    const checkCacheUpdatesRequired = (fetchRes: WPProbeResponse[] | null, dataFromCache = cachedData): UpdateRequiredObj =>{
        // NOTE: Probe CMS to compare server objects with any cached objects in the browser
        // If object hasn't been cached, or a cached object is outdated, trigger a full info fetch for that object
        if(fetchRes === null) {
            setIsUpdateRequired(true);
            return {success: false, isUpdateRequired: true};
        };
        
        const matchedObjects = getUpdateRequirementsList(fetchRes, dataFromCache);
        const invalidObjects = matchedObjects.flatMap((cacheObj: CacheProbeResult) => cacheObj.isStillValid ? [] : cacheObj.id);
        setIsUpdateRequired(!!invalidObjects.length);
        setInvalidCacheObjects(invalidObjects);
        return {success: true, isUpdateRequired: !!invalidObjects.length};
    }

    const mergeResWithCache = (resArry: CacheType[]): CacheType[] => {
        if(cachedData === []) return resArry;
        const returnArry = (Array.from(cachedData) as unknown) as CacheType[];
        resArry.map((resObj) => {
            const matchedIdx = returnArry.findIndex((cacheObj) => cacheObj.id === resObj.id);
            if(matchedIdx < 0) returnArry.push(resObj);
            else returnArry[matchedIdx] = resObj; 
        });
        return returnArry;
    };

    const saveCache = (fetchResponse: CacheType[]): void => {
        const updatedCacheDataArry = mergeResWithCache(fetchResponse);
        const saveData = JSON.stringify(updatedCacheDataArry);
        window.sessionStorage.setItem(cacheKey, saveData);
    };

    const getCacheObjectIdsToPurge = (): number[] => {
        // decide which objects currently in cache are no longer relevant and should be purged from the cache
        if(fetchRes === null) return [];
        return cachedData.flatMap((cacheObj: CacheType): number[] => {
            const isStillUsed = !!fetchRes.find((resObj: WPProbeResponse) => resObj.id === cacheObj.id);
            return isStillUsed ? [] : [cacheObj.id];
        });
    };
    
    const trimCache = (): void => {
        const itemsToRemove = getCacheObjectIdsToPurge();
        const cachedValues = Array.from(cachedData);
        itemsToRemove.map(idToRemove => {
            const idxToRemove = cachedValues.findIndex(cacheObj => cacheObj.id === idToRemove);
            cachedValues.splice(idxToRemove);
        });
        const saveData = JSON.stringify(cachedValues);
        window.sessionStorage.setItem(cacheKey, saveData);
    };
    
    const runCacheUpdate = async (resJson: CacheType[]): Promise<void> => {
        saveCache(resJson);
        setCachedData(readCacheDataAndParse());
        setIsUpdateRequired(false);
    };

    const getUpdateRequirement = (fetchRes: WPProbeResponse[] | null): UpdateRequiredObj => {
        const dataFromCache = readCacheDataAndParse()
        setCachedData(dataFromCache);
        return checkCacheUpdatesRequired(fetchRes, dataFromCache);
    };


    useEffect(() => {
        mergeOptions();
    }, []);
    
    useEffect(() => {
        // trimCache();
    }, [fetchRes]);

    return {cachedData, isLoading, runCacheUpdate, isUpdateRequired, getUpdateRequirement, readCacheDataAndParse};
}

export default useCache;
