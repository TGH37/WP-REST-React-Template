export const rootData = [
    {
      id: 1,
      title: "title 1",
      excerpt: "Excerpt 1",
      modified: "2021-09-12T18:44:12",
      featured_media: 6,
      slug: "slug 1"
    },
    {
      id: 2,
      title: "title 2",
      excerpt: "Excerpt 2",
      modified: "2021-08-12T18:44:12",
      featured_media: 0,
      slug: "slug 2"
    },
    {
      id: 3,
      title: "title 3",
      excerpt: "Excerpt 3",
      modified: "2021-09-12T19:44:12",
      featured_media: 5,
      slug: "slug 3"
    },
    {
      id: 4,
      title: "title 4",
      excerpt: "Excerpt 4",
      modified: "2021-09-12T18:43:12",
      featured_media: 9,
      slug: "slug 4"
    },
  ]

export const mediaData = [
    {
      id: 5,
      media_details: {sizes: {full: {source_url: "source string 5"}}},
    },
    {
      id: 6,
      media_details: {sizes: {full: {source_url: "source string 6"}}},
    },
    {
      id: 7,
      media_details: {sizes: {full: {source_url: "source string 7"}}},
    },
    {
      id: 8,
      media_details: {sizes: {full: {source_url: "source string 8"}}},
    },
    {
      id: 9,
      media_details: {sizes: {full: {source_url: "source string 9"}}},
    },
    {
      id: 10,
      media_details: {sizes: {full: {source_url: "source string 10"}}},
    },
  ]

  
  export const rootDataJSON = JSON.stringify(rootData);
  export const mediaDataJSON = JSON.stringify(mediaData);