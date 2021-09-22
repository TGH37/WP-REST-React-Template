/**
 * @jest-environment jsdom
 */

import { rootData, mediaData } from './CMSDataMock';
import {jest} from '@jest/globals'

/*
* Received this response when fetching with an invalid 'include' parameter
* Error recreated below
const emptyIncludeArryRejectionResponse = {
  code: "rest_invalid_param",
  message: "Invalid parameter(s): include",
  data: {
      status: 400,
      params: {
          include: "include[0] is not of type integer."
      },
      details: {
          include: {
              code: "rest_invalid_type",
              message: "include[0] is not of type integer.",
              data: {
                  param: "include[0]"
              }
          }
      }
  }
}
*/
class InvalidParamError extends Error {
  // Recreation of invalid parameter wordpress server response (See comments stated above)
  data: any
  constructor(parameter: string) {
    super(`Invalid parameter(s): ${parameter}`)
    this.name = "REST_Invalid_Param_Error";
    this.data = {
      status: 400,
      params: {
          include: "include[0] is not of type integer."
      },
      details: {
          include: {
              code: "rest_invalid_type",
              message: "include[0] is not of type integer.",
              data: {
                  param: "include[0]"
              }
          }
      }
    }
  }
}

const rootUrl = "http://www.react-test.dev.cc/wp-json/wp/v2/";
const postsUrl = "http://www.react-test.dev.cc/wp-json/wp/v2/posts";
const mediaUrl = "http://www.react-test.dev.cc/wp-json/wp/v2/media";
const rootDataFields = [
  "id",
  "modified",
  "featured_media",
];
const rootDataIds = [
  1,
  3,
  5
];

const parseEndpoint = (url: string): string => {
  if(!url || url === "") throw "no url received";
  const removedQueries = url.split("?")[0];
  const removedRoot = removedQueries.split("http://www.react-test.dev.cc/wp-json/wp/v2/")[1];
  return removedRoot ? removedRoot : "";
};


const parseQueryString = (query: string): {ids: Array<number>, fields: Array<string>} => {
  if(query === "") return {ids: [], fields: []};
  
  if(/include\[\]=(\D|$)/.test(query)) {
    // console.log(`Error: ${InvalidParamError.name}, query: ${query}`); 
    throw new InvalidParamError("include"); // regex tested on https://regexr.com/
  };

  if(/^\d$/.test(query)) return {ids: [parseInt(query)], fields: []};
  const splitQueries = query.split(/&/);
  const postIds = splitQueries.flatMap((queryItem) => queryItem.includes("include[]=") ? [parseInt(queryItem.split("include[]=")[1])] :[]);
  const fields = splitQueries.flatMap((queryItem) => {
    if(!queryItem.includes("_fields=")) return []
    const params = queryItem.split("_fields=")[1]
    return params.split(/,/g)
  })
  return {ids: postIds, fields}
}

const postsDataIncludeQueryString = rootDataIds.length ? `include[]=${rootDataIds.toString().replace(/,/g,"&include[]=")}` : ""; // actual format for querying certain posts
const postsDataFieldQueryString = `_fields=${rootDataFields.toString()}`; // actual format for returning certain fields

describe("Query String Parsing", () => {
  test("Successfully parse endpoint", () => {
    expect(parseEndpoint(`${rootUrl}`)).toBe("");
    expect(parseEndpoint(`${postsUrl}`)).toBe("posts");
    expect(parseEndpoint(`${mediaUrl}`)).toBe("media");
    expect(parseEndpoint(`${postsUrl}?foobar`)).toBe("posts");
  });

  test("parseQuery successfully throws errors when invalid Id 'include[]=' parameter is passed", () => {
    // Must wrap the function call in a callback, otherwise error won't be caught and test will fail, https://jestjs.io/docs/expect#tothrowerror
    expect(() => parseQueryString(`include[]=`)).toThrow(InvalidParamError);
    expect(() => parseQueryString(`include[]=&include[]=5`)).toThrow(InvalidParamError);
    expect(() => parseQueryString(`include[]=5&include[]=`)).toThrow(InvalidParamError);
  });

  test("Successfully parse query string", () => {
    expect(parseQueryString(``)).toStrictEqual({ids: [], fields: []});
    expect(parseQueryString(`5`)).toStrictEqual({ids: [5], fields: []});
    expect(parseQueryString(`${postsDataIncludeQueryString}`)).toStrictEqual({ids: rootDataIds, fields: []});
    expect(parseQueryString(`${postsDataFieldQueryString}`)).toStrictEqual({ids: [], fields: rootDataFields});
    expect(parseQueryString(`${postsDataIncludeQueryString}&${postsDataFieldQueryString}`)).toStrictEqual({ids: rootDataIds, fields: rootDataFields});
  });
});



const fetch = jest.fn((fields: string[], ids: number[], pathId?: number) => {
  // For ease of testing, fields are passed as if they had been parsed from query string of format: '?_fields=field1,field2,...,fieldN'
  /**
   *  For ease of testing, ids are passed as if they had been parsed from query string of format: '?include[]=id1&include[]=id2&include[]=...&include[]=idN'
   *  an empty include query will result in an invalid parameter error, as include[0] will be assumed
   */
  // PathId is for when a single id is passed as a slug e.g. "...posts/id"

  /** API Endpoints Tested: Endpoint ========== test ========== isResponseValid? ========== return Obj
   *  .../posts?include[]=1 ========== return specific object from DB ========== true ========== returns only the post object requested;
   *  .../posts?include[]=1&include[]=5 ========== return specific objects from DB ========== true ========== returns only the post objects requested;
   *  .../posts?include[]= ========== return specific object from DB ========== FALSE ========== returns error object described in "InvalidParamError";
   *  .../posts?include[]=1&include[]= ========== return specific objects from DB ========== FALSE ========== returns error object described in "emptyIncludeArryRejectionResponse";
   *  .../posts?_fields=id ========== Return specific field only, for all posts ========== true ========== returns 'id' key for each object in DB;
   *  .../posts?_fields= ========== Does empty field parameter still return valid response ========== true ========== returns all data in posts; 
   *  .../posts?& ========== Does empty query string still return valid response ========== true ========== returns 'id' key for each object in DB;
   *  .../posts?&_fields=id ========== Does empty first parameter (before '&') still return valid response ========== true ========== returns 'id' key for each object in DB;
   */
  


  return new Promise((resolve, reject) => {
    // if(!ids.length) reject(emptyIncludeArryRejectionResponse);
    const validPathId =  !!(rootData.findIndex((rootObj) => rootObj.id === pathId) + 1)
    if(pathId && !validPathId) reject({ code: "rest_post_invalid_id", message: "Invalid post ID.", data: { status: 404 }});


    const returnArry = ids.flatMap(id => {
      const dbItem: any = rootData.find((rootObj) => rootObj.id === id);
      if(!dbItem) return [];
      const returnObj: any = {};
      fields.map((field) => {
        Object.call(dbItem, Object.prototype.hasOwnProperty(field));
        returnObj[field] = dbItem[field];
      })
      return returnObj;
    } );

    // const validFieldArry = fields.map(field => Object.call(rootData[0], Object.prototype.hasOwnProperty(field)) );


    resolve(returnArry);
    // if(validIdArry.includes(false)) resolve();
  })
})






// const fetchUrl = `${rootUrl}?${rootDataIncludeQueryString}&${rootDataFieldQueryString}`

type rootDataProbeResponse = {id: number, modified: string, featured_media: number};


describe("Test mock Wordpress fetch responses", () => {

  // test("Returns Array type with empty queries", () => {
  //   return (fetch([], [])
  //   .then((resJSON) => {
  //     expect(Array.isArray(resJSON)).toBe(true);
  //   })
  //   )
  // });

  // test("Returns Array type with valid data", () => {
  //   return (fetch(rootDataFields, rootDataIds)
  //       .then((resJSON) => {
  //         expect(Array.isArray(resJSON)).toBe(true);
  //       })
  //   )
  // });

  // test("Returns Array type with empty data", () => {
  //   return (fetch([], [])
  //       .then((resJSON) => {
  //         expect(Array.isArray(resJSON)).toBe(true);
  //       })
  //   )
  // });

  // test("Returns empty array when invalid fields and ids are passed as query", () => {
  //   return (fetch(["is"], [16])
  //       .then((resJSON) => {
  //         expect(resJSON).toStrictEqual([]);
  //       })
  //   )
  // });
  
});





