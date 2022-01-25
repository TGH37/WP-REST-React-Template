import React, { useEffect, useState } from 'react'
import { WP_REST_API_Post, WP_REST_API_Attachment, WP_REST_API_Category } from 'wp-types';
import useCache from './useCache';

type WPFetchResponseType = WP_REST_API_Post | WP_REST_API_Attachment | WP_REST_API_Category;
type Endpoint = "posts" | "pages" | "media" | "categories" | "recipes";



interface Props {
    endpoint: Endpoint
    rootUrl?: string
    cacheObj?: CacheObject<WPFetchResponseType>
}

function useWPFetcher<FetchType extends WPFetchResponseType>(props: Props) {
    const {
        endpoint,
        rootUrl = "http://port-keto-bl.wingtipdigital.com/wp-json/wp/v2/",
        cacheObj = null
    } = props;

    const endpointToWPTypeMap: Map<Endpoint, WP_Endpoint> = new Map([
        ["posts", "post"],
        ["recipes", "post"],
        ["pages", "page"],
        ["media", "attachment"],
        ["categories", "category"],
    ]);

    const defaultQueryMap: Map<WP_Endpoint, string[]> = new Map([
        ["post",["id", "title", "excerpt", "modified", "featured_media", "slug", ]],
        ["page",["id", "title", "excerpt", "modified", "featured_media", "slug", "content"]],
        ["attachment",["id", "media_details", "alt_text", "modified", ]],
        ["category",["id", "name",]],
    ]);
    const defaultProbeQueryMap: Map<WP_Endpoint, string[]> = new Map([
        ["post",["id", "modified", "featured_media"]],
        ["page",["id", "modified", "featured_media"]],
        ["attachment",["id", "modified",]],
        ["category",["id", "name",]],
    ]);
    const queryToWPParamMap: Map<string, string> = new Map([
        ["ids","include="],
        ["fields","_fields="],
        ["slugs","slug="],
        ["sticky","sticky="],
    ]);

    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [endpointType, setEndpointType] = useState<WP_Endpoint>(endpointToWPTypeMap.get(endpoint) as WP_Endpoint);
    const [cacheObject, setCacheObject] = useState<CacheObject<FetchType> | null>(cacheObj as CacheObject<FetchType>)
    const [data, setData] = useState<Partial<FetchType>[]>([]);
    
    
    const defaultFetchOptions: FetchOptions = {
        ids: [],
        fields: defaultQueryMap.get(endpointType) as string[],
        appendFields: [],
        probeFields: defaultProbeQueryMap.get(endpointType) as string[],
        slugs: [],
        sticky: false,
        shouldCache: true,
        requestOptions: {}
    };

    const [fetchOptions, setFetchOptions] = useState<FetchOptions>(defaultFetchOptions);
    const sanitizeSlugs = (slugsIn: string[]) => slugsIn.map(slug => `"${slug}"`);
    const removeDuplicateAmpersands = (stringIn: string) => stringIn.replace(/&+/, "").replace(/&+$/, "");

    const carryOutFetch = async () => {
        if(cacheObject && fetchOptions.shouldCache) {
            const probeRes = await wpProbeFetch();
            if(probeRes === null) return
            const updateRequirement = cacheObject.getUpdateRequirement(probeRes) as UpdateRequiredObj;
            if(!updateRequirement.isUpdateRequired) {
                console.log(cacheObject.cachedData)
                setData(cacheObject.cachedData as Partial<FetchType>[]);
                setIsLoading(false);
                return;
            }
        }
            const fetchRes = await wpFetch();
            if(cacheObject && fetchOptions.shouldCache) cacheObject.runCacheUpdate(fetchRes);
            if(fetchRes!== null) setData(fetchRes);
            setIsLoading(false);

    }

    useEffect(() => {
        if(!isLoading) return;
        carryOutFetch();
    }, [isLoading])

    const handleFetchError = (err: any) => {
        if(err instanceof TypeError) {
            console.log("FetchError: a TypeError occurred, check lessons learned for more info" + err);
        } else {
            console.log(err);
        };
    };

    const getProbeQueryString = () => {
        const { probeFields, ids, slugs, sticky} = fetchOptions
        const root = `${rootUrl}${endpoint}?`
        const fieldString = `${queryToWPParamMap.get("fields")}${probeFields.toString()}`;
        const idString = ids.length ? `${queryToWPParamMap.get("ids")}${ids.toString()}` : "";
        const slugString = slugs.length ? `${queryToWPParamMap.get("slugs")}${sanitizeSlugs(slugs).toString()}` : "";
        const stickyString = sticky ? `${queryToWPParamMap.get("sticky")}${sticky}` : "";
        const returnString = [root, fieldString, idString, slugString, stickyString,].join("&");
        return removeDuplicateAmpersands(returnString);
    }

    const wpProbeFetch = async (): Promise<WPProbeResponse[] | null> => {
        try {
            const res = await fetch(getProbeQueryString(), fetchOptions.requestOptions);
            const resJson: WPProbeResponse[] = await res.json();
            return resJson;
        } catch (err) {
            handleFetchError(err);
            return [];
        };
    };

    const getQueryString = () => {
        const { fields, appendFields, ids, slugs, sticky } = fetchOptions
        const root = `${rootUrl}${endpoint}?`
        const fieldString = fields.length ? `${queryToWPParamMap.get("fields")}${fields.toString()}${appendFields.length ? `,${appendFields.toString()}` : ""}` : "";
        const idString = ids.length ? `${queryToWPParamMap.get("ids")}${ids.toString()}` : "";
        const slugString = slugs.length ? `${queryToWPParamMap.get("slugs")}${sanitizeSlugs(slugs).toString()}` : "";
        const stickyString = sticky ? `${queryToWPParamMap.get("sticky")}${sticky}` : "";
        const returnString = [root, fieldString, idString, slugString, stickyString,].join("&");
        return removeDuplicateAmpersands(returnString);
    }

    const wpFetch = async (): Promise<Partial<FetchType>[] | null> => {
        try {
            const res = await fetch(getQueryString(), fetchOptions.requestOptions);
            const resJson: Partial<FetchType>[] = await res.json();
            return resJson;
        } catch (err) {
            handleFetchError(err);
            return [];
        };
    };

    const runFetch = (options: Partial<FetchOptions>) => {
        setFetchOptions(Object.assign({}, fetchOptions, options));
        setIsLoading(true);
    };


    return {runFetch, isLoading, data};
}

export default useWPFetcher
