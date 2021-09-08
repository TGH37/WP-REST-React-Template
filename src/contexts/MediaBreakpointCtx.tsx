/**
 * taken from https://medium.com/better-programming/how-to-use-media-queries-programmatically-in-react-4d6562c3bc97
 */

import React, { useEffect, createContext, useState, ReactElement } from 'react'
import { mediaBreakpoints, mediaBreakpointStrings } from '../hooks/useBreakpoint';

interface ctxState {
  queryMatch?: mediaBreakpoints
  queries: mediaBreakpointStrings
}

const initialState: ctxState = {
  queryMatch: {},
  queries: {
    xs: '(min-width: 420px)',
    sm: '(min-width: 768px)',
    md: '(min-width: 1024px)',
    lg: '(min-width: 1998px)',
  },
}

export const BreakpointContext = createContext<ctxState>(initialState);

interface Props {
  children: any
  // queries: any
};

const BreakpointProvider = (props: Props) => {
  const { children} = props;
  const queries = initialState.queries;
  const [queryMatch, setQueryMatch] = useState({});

  useEffect(() => {
    const mediaQueryLists: any = {};
    const keys = Object.keys(queries);
    let isAttached: boolean = false;

    const handleQueryListener = () => {
      const updatedMatches = keys.reduce((acc: any, media: string) => {
        acc[media] = !!(mediaQueryLists[media] && mediaQueryLists[media].matches);
        return acc;
      }, {})
      setQueryMatch(updatedMatches);
    }

    if(window && window.matchMedia) {
      const matches: any = {};
      keys.forEach((media: string) => {
        const mediaKey = media as keyof mediaBreakpointStrings;
        if(typeof queries[mediaKey] === 'string') {
          mediaQueryLists[media] = window.matchMedia(queries[mediaKey]);
          matches[media] = mediaQueryLists[media].matches
        } else {
          matches[media] = false;
        }
      });

      setQueryMatch(matches);
      isAttached = true;
      keys.forEach((media: string) => {
        const mediaKey = media as keyof mediaBreakpointStrings;
        if(typeof queries[mediaKey] === 'string') {
          mediaQueryLists[media].addListener(handleQueryListener)
        }
      });
    }

    return () => {
      if(isAttached) {
        keys.forEach((media: string) => {
          const mediaKey = media as keyof mediaBreakpointStrings;
          if(typeof queries[mediaKey] === 'string') {
            mediaQueryLists[media].removeListener(handleQueryListener);
          }
        });
      }
    }
  }, [queries])

  return (
    <BreakpointContext.Provider value={{queryMatch, queries}}>
      {children}
    </BreakpointContext.Provider>
  )
}

export default BreakpointProvider;