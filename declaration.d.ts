declare module '*.scss';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';

interface ExctractedData {
    title: {
        rendered: string
    }, 
    excerpt: {
        rendered: string, 
        protected: boolean,
    }, 
    modified: string, id: number, 
    featured_media: number, 
    slug: string
}

interface WPTH_REST_Img_Size {
    file: string
    width: number
    height: number
    mime_type: string
    source_url: string
};
interface WPTH_REST_Img_Media_Details {
        width: number
        height: number
        file: string
        sizes: {
            thumbnail: WPTH_REST_Img_Size
            medium: WPTH_REST_Img_Size
            large: WPTH_REST_Img_Size
            medium_large: WPTH_REST_Img_Size
            full: WPTH_REST_Img_Size
        }
};

type mediaCacheMatch = {id: number, isStillValid: boolean, isStillUsed: boolean};
type mediaCacheUpdateSuccess = {success: boolean, isUpdateRequired: boolean, matchedMediaObjects: mediaCacheMatch[]};
type mediaDataProbeResponse = {id: number, modified: string};

type cacheMatch = {id: number, mediaId: number, isStillValid: boolean, isMediaUrlValid: boolean, isStillUsed: boolean};
type cacheUpdateSuccess = {success: boolean, isUpdateRequired: boolean, matchedPosts: cacheMatch[]};
type cacheUpdateFail = {success: boolean, isUpdateRequired: boolean, err?: any};
type updateQuery = {root: string, media: string};
type rootDataProbeResponse = {id: number, modified: string, featured_media: number};

interface WPTH_Cached_WP_Object {
    id: number
    modified?: WP_REST_API_Date_Time
};

interface CacheProbeResult {
    id: number
    isStillValid: boolean
};

type WP_Post_Endpoint = `${WP_Post_Type_Name}`;
type WP_Tax_Endpoint = `${WP_Taxonomy_Name}`;

type WP_Endpoint = WP_Post_Endpoint | WP_Tax_Endpoint;
type WPFetchResponseType = WP_REST_API_Post | WP_REST_API_Attachment | WP_REST_API_Category;

interface CacheObject<Type> {
    cachedData: Partial<Type>[]
    isLoading: boolean 
    isUpdateRequired: boolean 
    runCacheUpdate: Function 
    getUpdateRequirement: Function 
    readCacheDataAndParse: Function
}

interface WPProbeResponse {
    id: number,
    modified: string,
    featured_media?: number
}

interface UpdateRequiredObj {
    success: boolean
    isUpdateRequired: boolean
}

interface FetchObject<Type> {
    runFetch: Function
    isLoading: boolean
    data: Partial<Type>[]
}

interface ComposedRestSectionObject {
    title: string
    content: JSX.Element | JSX.Element[] | null
};

interface RestSectionTitleMatch {
    idx: number,
    title: string
};

interface FetchOptions {
    fields: string[]
    probeFields: string[]
    appendFields: string[]
    slugs: string[]
    sticky: boolean
    shouldCache: boolean
    ids: string[]
    requestOptions: Partial<RequestInit>
};

type RecipeQueryParamType = "all" | "beginner" | "intermediate" | "expert";

type imgData = {src: string, alt: string};