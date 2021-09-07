/**
 * taken from https://medium.com/better-programming/how-to-use-media-queries-programmatically-in-react-4d6562c3bc97
 */

import React, { useEffect, createContext, useState, ReactElement } from 'react'

// interface state {}

export const BreakpointContext = createContext({});

interface Props {
  children: any
  queries: any
};

const BreakpointProvider = (props: Props) => {
  const { children, queries} = props
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
        if(typeof queries[media] === 'string') {
          mediaQueryLists[media] = window.matchMedia(queries[media]);
          matches[media] = mediaQueryLists[media].matches
        } else {
          matches[media] = false;
        }
      });

      setQueryMatch(matches);
      isAttached = true;
      keys.forEach(media => {
        if(typeof queries[media] === 'string') {
          mediaQueryLists[media].addListener(handleQueryListener)
        }
      });
    }

    return () => {
      if(isAttached) {
        keys.forEach(media => {
          if(typeof queries[media] === 'string') {
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