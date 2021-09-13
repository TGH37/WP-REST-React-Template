import { useEffect, useState } from "react";

interface Props {
    cacheKey: string

};

function useParsedCache(props: Props) {
    const {
        cacheKey,

    } = props;

    const [cachedData, setCachedData] = useState<any[]>([])
    
    useEffect(() => {
        const cachedValueRaw = window.sessionStorage.getItem(cacheKey);
        if(cachedValueRaw !== null && cachedValueRaw.length) setCachedData(JSON.parse(cachedValueRaw));
    }, [])

    return cachedData;
};

export default useParsedCache;