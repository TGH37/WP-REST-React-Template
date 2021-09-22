/**
 * @jest-environment jsdom
 */

import cache, { rootCache, mediaCache, rootCacheJSON, mediaCacheJSON, } from "./cacheMock";
import { rootData, mediaData } from './CMSDataMock';
import {jest} from '@jest/globals'

const rootCacheKey = "keto_bps";
const mediaCacheKey = "keto_bps_media";

type keyType = "keto_bps" | "keto_bps_media"

const sessionStorageMock = function() {
  let sessionStorage: any = {};
  return {
    getItem: function(key: string) {
      return sessionStorage[key];
    },
    setItem: function(key: string, value: string) {
      sessionStorage[key] = value.toString();
    },
    clear: function() {
      sessionStorage = {};
    }
  };
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock() });


const getParsedCache = (key: keyType = rootCacheKey): Array<any> => {
  const cachedValueRaw = window.sessionStorage.getItem(key);
  return cachedValueRaw ? JSON.parse(cachedValueRaw) : [];
};


describe("Reading from session storage", () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  });
  test("Converts cache storage back to javascript array", () => {
    window.sessionStorage.setItem(rootCacheKey, rootCacheJSON);
    window.sessionStorage.setItem(mediaCacheKey, mediaCacheJSON);
    expect(getParsedCache(rootCacheKey)).toStrictEqual(rootCache);
    expect(getParsedCache(mediaCacheKey)).toStrictEqual(mediaCache);
  });
  
  test("returns empty array if session storage item not found", () => {
    expect(getParsedCache(mediaCacheKey)).toStrictEqual([]);
  });
});



type mediaCacheMatch = {id: number, isStillValid: boolean, isStillUsed: boolean};
type rootCacheMatch = {id: number, mediaId: number, isStillValid: boolean, isMediaUrlValid: boolean, isStillUsed: boolean};
type cacheMatch = rootCacheMatch | mediaCacheMatch;


const removeMediaFromCache = (cacheKey: keyType, cacheMatchArry: cacheMatch[]): void => {
  const itemsToRemove = cacheMatchArry.filter(matchObj => !matchObj.isStillUsed);
  const cachedValues = getParsedCache(cacheKey);
  itemsToRemove.map(matchObj => {
      const idxToRemove = cachedValues.findIndex(cacheObj => cacheObj.id === matchObj.id);
      cachedValues.splice(idxToRemove);
  });
  const saveData = JSON.stringify(cachedValues);
  window.sessionStorage.setItem(cacheKey, saveData);
}

const mediaMatch: mediaCacheMatch[] = [
  {id: 6, isStillValid: true, isStillUsed: true},
  {id: 4, isStillValid: true, isStillUsed: true},
  {id: 8, isStillValid: true, isStillUsed: true},
]

const rootMatch: rootCacheMatch[] = [
  {id: 5, mediaId: 6, isStillUsed: true, isStillValid: true, isMediaUrlValid: true},
  {id: 4, mediaId: 3, isStillUsed: false, isStillValid: false, isMediaUrlValid: true},
  {id: 3, mediaId: 4, isStillUsed: true, isStillValid: true, isMediaUrlValid: false},
]


// describe("Removing from session storage", () => {
//   test("Converts cache storage back to javascript array", () => {
//     expect(removeMediaFromCache(mediaCacheKey)).toStrictEqual([]);
    
//   });
  
//   test("returns empty array if session storage item not found", () => {
//     expect(getParsedCache(mediaCacheKey)).toStrictEqual([]);
//   });
// });