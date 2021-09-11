import React, { useEffect, useState } from 'react';
import styles from 'src/styles/blog.module.scss'

interface Props {
    title: string,
    excerpt: string
    meta: string[]
    feautredMediaId: number
};

function BlogPreviewItem(props: Props) {
    const {title, excerpt, meta, feautredMediaId} = props;
    const [mediaUrl, setMediaUrl] = useState<string | null>(null)

    useEffect(() => {
        if(feautredMediaId === 0) return;
        fetch(`http://www.react-test.dev.cc/wp-json/wp/v2/media/${feautredMediaId}`)
        .then(res => res.json())
        .then(res => setMediaUrl(res.media_details.sizes.full.source_url))
        .catch(err => console.log(err))
    }, []);

    const pushBlogSlug = () => {
        
    }

    return (
        <div className={styles.previewCard} onClick={() => {}}>
            <div className={`${styles.cardImgContainer} ${mediaUrl ? "" : styles.emptyImgContainer}`}>
               { mediaUrl ? <img src={mediaUrl} alt="" /> : <p>No Image Found...</p>}
            </div>
            <h3>{title}</h3>
            <p dangerouslySetInnerHTML={{__html: excerpt}}></p>
            <div>{meta.map((data) => <span>{data}</span>)}</div>
        </div>
    );
};

export default BlogPreviewItem;
