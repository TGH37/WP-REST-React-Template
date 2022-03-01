import React from 'react';
import styles from 'src/styles/blog.module.scss'
import type { WP_REST_API_Attachment } from 'wp-types';

interface Props {
    postData: any
    postMedia: WP_REST_API_Attachment[]
};

function BlogPreviewItem(props: Props) {
    const {postMedia, postData} = props;
    const { title, excerpt, modified}: ExctractedData = postData;
    
    const image = () => {
        if(!postMedia.length) return <p>No Image Found...</p>

        const featuredImgObject = postMedia[0];
        const mediaDetails = (featuredImgObject.media_details as unknown) as WPTH_REST_Img_Media_Details;
        const postUrl = postMedia.length ? mediaDetails.sizes.full : "";
        const mediaData = postMedia.length ? {
            src: mediaDetails.sizes.full.source_url,
            alt: featuredImgObject.alt_text,
        } : {};

        return ( 
        <div className={`${styles.cardImgContainer} ${postUrl ? "" : styles.emptyImgContainer}`}>
            <img src={mediaData.src} alt={mediaData.alt} />
        </div>)
    }

    const meta = [modified];
    return (
        <div className={styles.previewCard} onClick={() => {}}>
            { image() }
            <h3 dangerouslySetInnerHTML={{__html: title.rendered}}></h3>
            <p dangerouslySetInnerHTML={{__html: excerpt.rendered}}></p>
            <div>{meta.map((data, idx) => <span key={`${title}_meta_${idx}`}>{data}</span>)}</div>
        </div>
    );
};

export default BlogPreviewItem;
