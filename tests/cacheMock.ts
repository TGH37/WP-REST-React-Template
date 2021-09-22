export const rootCache = [
    {
      id: 5,
      title: "title 1",
      excerpt: "Excerpt 1",
      modified: "2021-09-12T18:44:12",
      featured_media: 6,
      slug: "slug 1"
    },
    {
      id: 1,
      title: "title 2",
      excerpt: "Excerpt 2",
      modified: "2021-09-12T18:44:12",
      featured_media: 0,
      slug: "slug 2"
    },
  ]

export const mediaCache = [
    {
      id: 6,
      media_details: {sizes: {full: {source_url: "source string 1"}}},
    },
  ]

  
  export const rootCacheJSON = JSON.stringify(rootCache);
  export const mediaCacheJSON = JSON.stringify(mediaCache);
  const cache: {keto_bps: any, keto_bps_media: any}  = {
    keto_bps: rootCacheJSON,
    keto_bps_media: mediaCacheJSON,
  }

  export default cache;