import React, { useEffect, useMemo, useState } from 'react';

interface CacheProps {
    url: string
    watchFields: string[]
    cacheFields: string[]
    cacheKey: string
    options?: CacheOptions
};

// NOTE: Think about using media breakpoints to control caching mode, e.g. mobile devices may require lean caching for memory reasons

interface CacheOptions {
    mode?: "lean" | "verbose"
    cacheSource?: "localStorage" | "sessionStorage" | "cookie" //TODO: Implement different caching solutions
}

function useCache<CacheType extends WPTH_Cached_WP_Object>(props: CacheProps) {
    const {url, watchFields, cacheKey, cacheFields, options} = props;

    const cacheFieldsUrlSection = `?_fields=${cacheFields.toString()}`;
    const [isUpdateRequired, setIsUpdateRequired] = useState<boolean>(false);
    const [invalidCacheObjects, setInvalidCacheObjects] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cacheInputUrlSection, setCacheInputUrlSection] = useState<string>('include[]='); // TODO: add 'dependants' option, so only relevant data is cached instead of the current model which caches all results from endpoint
    
    const [fetchRes, setFetchRes] = useState<rootDataProbeResponse[] | null>(null);
    const [cachedData, setCachedData] = useState<CacheType[]>([]);
    
    const defaultCacheOptions: CacheOptions = useMemo(() => {
        return {
            mode: "verbose",
            cacheSource: "sessionStorage",
        };
    }, []);

    const [cacheOptions, setCacheOptions] = useState<CacheOptions>(defaultCacheOptions);

    const mergeOptions = () => {
        setCacheOptions({ ...defaultCacheOptions, ...options });
      };
    
    const getParsedCacheData = (): Array<any> => {
        // read, parse and return cached data from 
        const cachedValueRaw = window.sessionStorage.getItem(cacheKey);
        return cachedValueRaw ? JSON.parse(cachedValueRaw) : [];
    };

    const fetchServerUpdateFields = async (): Promise<rootDataProbeResponse[]> => {
        try {
            const res = await fetch(`${url}?_fields=${watchFields.toString()}`);
            const resJSON = await res.json() as rootDataProbeResponse[]; 
            setFetchRes(resJSON);
            return resJSON;
        } catch (err) {
            console.log("fetch error: " + err);
            setFetchRes(null);
            return [];
        };
    };

    const getUpdateRequirementsList = (cachedObjects: CacheType[]): CacheProbeResult[] => {
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

    const checkCacheUpdatesRequired = () =>{
        // Probe CMS to compare server objects with any cached objects in the browser
        // If a object hasn't been cached, or a cached object is outdated, trigger a full info fetch for that object
        if(fetchRes === null) return {success: false, isUpdateRequired: true} as cacheUpdateFail;
        if(cachedData === []) return {success: true, isUpdateRequired: true};

        const matchedObjects = getUpdateRequirementsList(cachedData);
        const invalidObjects = matchedObjects.flatMap((cacheObj: CacheProbeResult) => cacheObj.isStillValid ? [] : cacheObj.id);
        setIsUpdateRequired(!!invalidObjects.length);
        setInvalidCacheObjects(invalidObjects);
    }

    const mergeCacheAndFetchData = (resArry: CacheType[]): CacheType[] => {
        if(cachedData === []) return resArry;
        const returnArry = (Array.from(cachedData) as unknown) as CacheType[];
        resArry.map((resObj) => {
            const matchedIdx = returnArry.findIndex((cacheObj) => cacheObj.id === resObj.id);
            if(matchedIdx < 0) returnArry.push(resObj);
            else returnArry[matchedIdx] = resObj; 
        });
        return returnArry;
    };

    const updateCache = (fetchResponse: CacheType[]): void => {
        const updatedCacheDataArry = mergeCacheAndFetchData(fetchResponse);
        const saveData = JSON.stringify(updatedCacheDataArry);
        // console.log("merge: "+saveData);
        window.sessionStorage.setItem(cacheKey, saveData);
    };

    const getCacheObjectIdsToPurge = (): number[] => {
        // decide which objects currently in cache are no longer relevant and should be purged from the cache
        if(fetchRes === null) return [];
        return cachedData.flatMap((cacheObj: CacheType): number[] => {
            const isStillUsed = !!fetchRes.find((resObj: rootDataProbeResponse) => resObj.id === cacheObj.id);
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

    const getFetchQuery = (): string => {
        const includeQuerySegment = invalidCacheObjects.length ? `include[]=${invalidCacheObjects.toString().replace(/,/g,"&include[]=")}` : "";
        return `?${includeQuerySegment}&${cacheFieldsUrlSection}`;
    };

    const fetchAndCache = async (query: string): Promise<void> => {
        try {
            const res = await fetch(`${url}${query}`);
            const resJson = await res.json();
            updateCache(resJson);
        } catch (err) {
            console.log("All Data Fetch Error: " + err);           
        };
    };

    const runCacheUpdate = async (): Promise<void> => {
        setIsLoading(true);
        const fullQueryString = getFetchQuery();
        await fetchAndCache(fullQueryString);
        setCachedData(getParsedCacheData());
        setIsLoading(false);
    }

    useEffect(() => {
        // initialiser
        mergeOptions();
        setCachedData(getParsedCacheData());
        fetchServerUpdateFields();
    }, []);
    
    useEffect(() => {
        // console.log(fetchRes)
        trimCache();
        checkCacheUpdatesRequired();
    }, [fetchRes]);

    useEffect(() => {       
        // console.log(invalidCacheObjects) 
        if(!isUpdateRequired) return;
        runCacheUpdate();
    }, [isUpdateRequired]);



    return [cachedData, isLoading];
}

export default useCache;
