/**
 * taken from https://medium.com/better-programming/how-to-use-media-queries-programmatically-in-react-4d6562c3bc97
 */

import React, { useContext } from 'react';
import { BreakpointContext } from '../contexts/MediaBreakpointCtx';

export type mediaBreakpoints = {
  xs?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
}

function useBreakpoint() {
  const context = useContext(BreakpointContext);
  if(context === {}) {
    throw new Error('useBreakpoint must be used within BreakpointProvider');
  }
  return context;
}

export default useBreakpoint;